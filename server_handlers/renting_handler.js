const dbHelper = require("./database_helper");

// rent: itemId, clientId, isActive, from, to, discount, requestMessage, isAccepted, depositId, paymentId,
//      clientRecieptionLogId, clientSendLogId, ownerRecieptionLogId, ownerSendLogId
// rent-changelog: rentId, from, to, isAccepted

const succeed = "succeed"
const failed = "failed"
const waiting = "waiting"

function checkLinkCondition(r,fieldInRent, secondDb, fieldInDb, condition=null){
    if (!r[fieldInRent])
        return failed;
    _id = r[fieldInRent];
    const d = dbHelper.findDocument(secondDb,{_id});
    if (d[fieldInDb]){
        if(!condition)
            return succeed;
        if(condition(d[fieldInDb])) return succeed;
    }
    return waiting;
}

class rentingHandler{
    static handleRentRequest = async function(itemId,clientId,body){
        let obj = {itemId,clientId,requestMessage:body.message,isActive:true};
        const r = await dbHelper.insertDocument("rent",obj);
        return r;
    }

    static handleDeposit = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        const method = body.method;
        //write to payment collection
        const payObj = {method,receivedMoney:0};
        if (method == "credit"){
            payObj.cardNumber = body.card;
            payObj.ccv = body.ccv;
            payObj.issueDate = body.issueDate;
        }
        let r = await dbHelper.insertDocument("payment",payObj);
        //add payment id to document
        r = await dbHelper.updateDocument("rent",queryObj,{depositId:r.id});
        return r;
    }

    static handleRecieve = async function(itemId,clientId,body){
        const qOb = {itemId,clientId,isActive:true}
        let obj = {itemId,clientId,message:body.message};
        const r = await dbHelper.insertDocument("rent",obj);
        return r;
    }

    static handleReturn = async function(itemId,clientId,body){
        let obj = {itemId,clientId,message:body.message};
        const r = await dbHelper.insertDocument("rent",obj);
        return r;
    }



    static fetchRentStatus = async function(params){
        const itemId = params.itemId;
        const clientId = params.clientId;
        const qObj = {itemId,clientId,isActive:true}
        let r = await dbHelper.findDocument("renting",qObj)[0];
        if (r == null) return failed;
        let _id = "",c1,c2;
        switch (params.stage) {
            case "1":
                if (r.isAccepted === true)
                    return succeed; 
                if (r.isAccepted === false)
                    return failed;
                return waiting;
            case "2":
                if (r.isAccepted !== true || !r.requestMessage)
                    return failed;
                return checkLinkCondition(r,"depositId","payment","receivedMoney",(v)=>{
                    return v > 0;
                });
            case "3":
                c1 = checkLinkCondition(r,"ownerSendLogId","image-log","imageLocation");
                c2 = checkLinkCondition(r,"clientReceiptionLogId","image-log","imageLocation");
                if (c1 != succeed){
                    if (checkLinkCondition(r,"depositId","payment","receivedMoney",(v)=>v > 0) == "succeed"){
                        return waiting;
                    }
                }
                if (c2 == succeed) return succeed;
                return failed;
            case "4":
                c1 = checkLinkCondition(r,"ownerReceiptionLogId","image-log","imageLocation");
                c2 = checkLinkCondition(r,"clientSendLogId","image-log","imageLocation");
                if (c2 != succeed) return failed;
                if (c1 != succeed) return waiting;
                return succeed;
        }
        return r;
    }
}
module.exports = rentingHandler
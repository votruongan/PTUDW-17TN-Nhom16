const dbHelper = require("./database_helper");
const stuffHelper = require("./stuff_handler");
const {writeAllBase64ImagesLog} = require("./misc_helper");
const { findDocument } = require("./database_helper");

// rent: itemId, clientId, isActive, fromDateTime, toDatetime, discount, 
//      requestMessage, isAccepted, depositPaymentId, depositPaymentId, clientReceptionLogId,
//      clientSendLogId, ownerReceptionLogId, ownerSendLogId, currentChangeRequest
//      deliverMethod, deliverAddress, returnMethod, returnAddress, finishPaymentId
// rent-change-log: rentId, from, to, isAccepted

const succeed = "succeed"
const failed = "failed"
const waiting = "waiting"

async function checkLinkCondition(r,fieldInRent, secondDb, fieldInDb, condition=null){
    if (!r[fieldInRent])
        return failed;
    let _id = r[fieldInRent];
    console.log(secondDb,_id)
    let d = await dbHelper.findDocument(secondDb,{_id});
    d = d[0];
    console.log(d,fieldInDb,d[fieldInDb])
    if (d[fieldInDb]){
        if(!condition)
            return succeed;
        console.log(condition(d[fieldInDb]));
        if(condition(d[fieldInDb])) return succeed;
    }
    return waiting;
}

function rentQueryObject(params){
    return {
        itemId: params.itemId,
        clientId: params.clientId,
        isActive: params.isActive || true
    };
}

class rentingHandler{
    static handleRentRequest = async function(itemId,clientId,body){
        let obj = {itemId,clientId,requestMessage:body.message,isActive:true,
                    fromDateTime: body.fromDateTime,toDateTime: body.toDateTime};
        const itemInfo = await dbHelper.findDocument("test-item",{itemId});
        obj.rentPrice =itemInfo.rentPrice;
        const r = await dbHelper.insertDocument("rent",obj);
        return r;
    }  

    static handleDeposit = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        const method = body.method;
        //write to payment collection
        const payObj = {method,receivedMoney:162000};
        if (method == "credit"){
            payObj.cardNumber = body.card;
            payObj.ccv = body.ccv;
            payObj.expireDate = body.expireDate;
        }
        let r = await dbHelper.insertDocument("payment",payObj);
        //add payment id to document
        console.log("inserted payment result:",r._id);
        r = await dbHelper.updateDocument("rent",queryObj,{depositPaymentId:r._id});
        return r;
    }

    static handleReceieve = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        //write images to image-log collection and get id
        const writeRes = writeAllBase64ImagesLog(itemId,clientId,body);
        //write images to image-log collection
        const logObj = {
            logPath: writeRes.logPath,
            extensions: writeRes.extensions
        };
        let r = await dbHelper.insertDocument("image-log",logObj);
        //add log-image id to document
        r = await dbHelper.updateDocument("rent",queryObj,{clientReceptionLogId:r._id});
        return r;
    }

    static handleChangeRequest = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        const activeResult = await dbHelper.findDocument("rent",queryObj);
        let obj = {
            rentId: activeResult._id,
            originalEndTime: activeResult.toDateTime,
            originalReturnMethod: activeResult.returnMethod,
            originalReturnAddress: activeResult.returnAddress,
            changeEndTime: body.endDateTime,
            changeReturnMethod: body.returnMethod,
            changeReturnAddress: body.returnAddress,
            isAccepted: waiting
        };
        let r = await dbHelper.insertDocument("rent-change-log",obj);
        r = await dbHelper.updateDocument("rent",queryObj,{
            currentChangeRequest: r._id
        });
        return r;
    }

    static handleReturn = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        //write images to image-log collection and get id
        const writeRes = writeAllBase64ImagesLog(itemId,clientId,body);
        //write images to image-log collection
        const logObj = {
            logPath: writeRes.logPath,
            extensions: writeRes.extensions
        };
        let r = await dbHelper.insertDocument("image-log",logObj);
        //add log-image id to document
        r = await dbHelper.updateDocument("rent",queryObj,{clientSendLogId:r._id});
        return r;
    }

    
    static handleFinishPayment = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        const method = body.method;
        //write to payment collection
        const payObj = {method,receivedMoney:162000};
        if (method == "credit"){
            payObj.cardNumber = body.card;
            payObj.ccv = body.ccv;
            payObj.expireDate = body.expireDate;
        }
        let r = await dbHelper.insertDocument("payment",payObj);
        //add payment id to document
        console.log("inserted payment result:",r._id);
        r = await dbHelper.updateDocument("rent",queryObj,{finishPaymentId:r._id});
        return r;
    }


    static fetchChangeRequest = async function(itemId,clientId){
        const queryObj = {itemId,clientId,isActive:true}
        const res = await dbHelper.findDocument("rent",queryObj);
        let dataObj = await dbHelper.findDocument("rent-change-log",{
            _id:res[0].currentChangeRequest
        })
        dataObj = dataObj[0];
        if (dataObj){
            return dataObj;
        }
        return {};
    }

    static fetchRentDateTime = async function(params){
        const qObj = rentQueryObject(params);
        let r = await dbHelper.findDocument("rent",qObj);
        r = r[0];
        if (r == null) return failed;
        return r;
    }

    static fetchRentStatus = async function(params){
        const qObj = rentQueryObject(params);
        console.log(qObj);
        let r = await dbHelper.findDocument("rent",qObj);
        r = r[0];
        if (r == null) return failed;
        let _id = "",c1,c2;
        switch (params.stage) {
            case "1":
                if (r.isAccepted == null)
                    return waiting;
                if (r.isAccepted === true)
                    return succeed; 
                if (r.isAccepted === false)
                    return failed;
                return waiting;
            case "2":
                if (r.isAccepted !== true || !r.requestMessage)
                    return failed;
                return await checkLinkCondition(r,"depositPaymentId","payment","receivedMoney",(v)=>{
                    return v > 0;
                });
            case "3":
                c1 = await checkLinkCondition(r,"ownerSendLogId","image-log","logPath");
                c2 = await checkLinkCondition(r,"clientReceptionLogId","image-log","logPath");
                if (c1 != succeed){
                    if (await checkLinkCondition(r,"depositPaymentId","payment","receivedMoney",(v)=>v > 0) == succeed){
                        console.log("waiting");
                        return waiting;
                    }
                }
                // owner has send item, check item on client side
                if (c2 == succeed) return succeed;
                return failed;
            case "4":
                c1 = await checkLinkCondition(r,"ownerReceptionLogId","image-log","logPath");
                c2 = await checkLinkCondition(r,"clientSendLogId","image-log","logPath");
                if (c2 != succeed) return failed;
                if (c1 != succeed) return waiting;
                return succeed;
            case "5":
                c1 = await checkLinkCondition(r,"finishPaymentId","payment","receivedMoney",(v)=>v>0);
                if (c1 != succeed) return failed;
                return succeed;
        }
        return waiting;
    }
}


module.exports = rentingHandler
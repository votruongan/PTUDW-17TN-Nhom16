const dbHelper = require("./database_helper");
const {writeBase64ToFile} = require("./misc_helper");

// rent: itemId, clientId, isActive, fromDateTime, toDatetime, discount, 
//      requestMessage, isAccepted, depositId, paymentId, clientRecieptionLogId,
//      clientSendLogId, ownerRecieptionLogId, ownerSendLogId
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

function rentQueryObject(params){
    return {
        itemId: params.itemId,
        clientId: params.clientId,
        isActive: params.isActive || true
    };
}

class rentingHandler{
    static handleRentRequest = async function(itemId,clientId,body){
        let qObj =  rentQueryObject({itemId,clientId});
        const r = await dbHelper.updateDocument("rent",qObj,{isAccepted:body.isAccepted});
        return r;
    }

    static handleSendItem = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        const imgs = body.images;
        const exts = body.extensions;
        //save images to files
        const logPath = `./assets/logImages/${itemId}_${clientId}_${Date.now()}`;
        for(let i = 0; i < imgs.length; i++){
            writeBase64ToFile(imgs[i],logPath,i+"."+exts[i]);
        }
        //write images to image-log collection
        const logObj = {logPath, extensions: exts};
        let r = await dbHelper.insertDocument("image-log",logObj);
        //add log-image id to document
        r = await dbHelper.updateDocument("rent",queryObj,{ownerSendLogId:r._id});
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
        return waiting;
    }
}


module.exports = rentingHandler
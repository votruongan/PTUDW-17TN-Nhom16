const dbHelper = require("./database_helper");
const {writeAllBase64ImagesLog} = require("./misc_helper");

// rent: itemId, clientId, isActive, fromDateTime, toDatetime, discount, 
//      requestMessage, isAccepted, depositId, paymentId, clientReceipttionLogId,
//      clientSendLogId, ownerReceipttionLogId, ownerSendLogId
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
        const writeRes = writeAllBase64ImagesLog(itemId,clientId,body);
        //write images to image-log collection
        const logObj = {
            logPath: writeRes.logPath,
            extensions: writeRes.extensions
        };
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

    static handleChangeRequest = async function(itemId,clientId,body){
        let queryObj = {itemId,clientId,isActive:true};
        let r = await dbHelper.findDocument("rent",queryObj);
        r = r[0];
        if (!body.isAccepted){
            r = await dbHelper.updateDocument("rent-change-log",{
                _id:r.currentChangeRequest
            },{
                isAccepted: failed
            });
            return r;
        }
        // modify the status of the change request
        await dbHelper.updateDocument("rent-change-log",{
            _id:r.currentChangeRequest
        },{
            isAccepted: succeed
        });
        // get info of the change request
        r = await dbHelper.findDocument("rent-change-log",{_id:r.currentChangeRequest
        });
        console.log(r)
        r = r[0];
        // write change request info to rent collection
        r = await dbHelper.updateDocument("rent",queryObj,{
            toDateTime: r.changeEndTime,
            returnMethod: r.changeReturnMethod,
            returnAddress: r.changeReturnAddress,
        });
        return r;
    }

    static fetchRentDateTime = async function(params){
        const qObj = rentQueryObject(params);
        let r = await dbHelper.findDocument("rent",qObj);
        r = r[0];
        if (r == null) return failed;
        return r;
    }
}


module.exports = rentingHandler
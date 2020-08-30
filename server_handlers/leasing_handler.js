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
        if (body.isAccepted === false){
            await dbHelper.updateDocument("rent",qObj,{isAccepted:false, isActive: false});
            return true;
        }
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

    static handleReceive = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        const writeRes = writeAllBase64ImagesLog(itemId,clientId,body);
        //write images to image-log collection
        const logObj = {
            logPath: writeRes.logPath,
            extensions: writeRes.extensions
        };
        let r = await dbHelper.insertDocument("image-log",logObj);
        //add log-image id to document
        r = await dbHelper.updateDocument("rent",queryObj,{ownerReceptionLogId:r._id});
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

    
    //save comment of user and close the rent
    static handleFinish = async function(itemId,clientId,body){
        const queryObj = {itemId,clientId,isActive:true}
        let r = await dbHelper.findDocument("rent",queryObj);
        let a = await dbHelper.findDocument("Stuff",{itemId});
        a = a[0];
        if (!a) a={owner:321}
        const writeObj = {
            rentId : r[0]._id,
            sender: a.owner,
            receiver: clientId,
            rating: body.rating,
            comment: body.comment
        }
        r = await dbHelper.insertDocument("rent-lease-comment",writeObj)
        r = await dbHelper.updateDocument("rent",queryObj,{ownerCommentId:r._id});
        r = await dbHelper.findDocument("rent",queryObj);
        r = r[0];
        if (r.clientCommentId && r.ownerCommentId){
            //finish rent
            r = await dbHelper.updateDocument("rent",queryObj,{isActive:false});
        }
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
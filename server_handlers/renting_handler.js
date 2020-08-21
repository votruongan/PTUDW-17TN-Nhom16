const dbHelper = require("./database_helper");
class rentingHandler{
    static getStageResult(itemId,clientId,stageId){
        let query = {itemId,clientId}
        dbHelper.findDocument("booking-"+stageId,query);
    }

    static writeBookingRequest = async function(itemId,clientId,message){
        let obj = {itemId,clientId,message};
        const r = await dbHelper.insertDocument("renting-1",obj);
        return r;
    }

    static writeToRenting = async function(stage,params){
        const r = await dbHelper.insertDocument("renting-"+stage,params);
        return r;
    }

    static fetchRentStatus = async function(params){
        const itemId = params.itemId;
        const clientId = params.clientId;
        let r = await dbHelper.findDocument("renting-"+params.stage,{itemId,clientId});
        return r;
    }
}
module.exports = rentingHandler
const dbHelper = require("./database_helper")
class leasingHandler{
    static getStageResult(itemId,clientId,stageId){
        let query = {itemId,clientId}
        dbHelper.findDocument("booking-"+stageId,query);
    }

    static writeBookingRequest = function(itemId,clientId,message){
        let obj = {itemId,clientId,message};
        dbHelper.insertDocument("booking-1",obj);
    }

    static fetchBookingRequest = function(itemId,successCallBack){
        dbHelper.findDocument("booking-1",{itemId},successCallBack);
    }
}
module.exports = leasingHandler
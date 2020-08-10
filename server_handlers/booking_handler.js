const dbHelper = require("./database_helper")

function sendBookingRequest(itemId,clientId,message){
    let obj = {itemId,clientId,message};
    dbHelper.insertDocument("booking-1",obj);
}

function fetchBookingRequest(itemId,successCallBack){
    dbHelper.findDocument("booking-1",{itemId},successCallBack);
}

module.exports = {
    fetchBookingRequest,
    sendBookingRequest,
};
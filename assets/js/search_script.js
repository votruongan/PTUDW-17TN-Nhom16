var startRentTime = document.getElementById("startDateTime");
var endRentTime = document.getElementById("endDateTime");
function convertFormat(input){
	return input.toISOString().slice(0,19);
}

function offsetFromNow(hours){
	var dtNow = Date.now();
	hours -= ((new Date()).getTimezoneOffset()/60);
	return new Date(dtNow + hours * 60 * 60 * 1000);
}


function initDateTimePicker() {
	var dtString = offsetFromNow(6);
	startRentTime.value = convertFormat(dtString);
	var dtString = offsetFromNow(30);
	endRentTime.value = convertFormat(dtString);
}


initDateTimePicker();
function initMap() {
    var position = { lat: 10.7624176, lng: 106.6820081 }
    var map = new google.maps.Map(document.getElementById("map"), {
        center: position,
        zoom: 16
    });
    var marker = new google.maps.Marker({
        position: position,
        map: map,
    });
}

$('.1stuff').click(function(){
    location.href="./info"
})

$(function(){
    $('.btnss').click(function(){
        $('.btnss').removeClass('acctive')
        $(this).addClass('acctive')
    })
})

var startRentTime = document.getElementById("startDateTime");
var endRentTime = document.getElementById("endDateTime");

function initPlaceAutocomplete() {
    var input = document.getElementById("pac-input");
    var autocomplete = new google.maps.places.Autocomplete(intput);
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']
    );
    var infoWindow = new google.maps.InfoWindow();
}

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

// initPlaceAutocomplete();
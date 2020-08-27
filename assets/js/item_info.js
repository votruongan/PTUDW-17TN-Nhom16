function initPlaceAutocomplete() {
    var input = document.getElementById("pac-input");
    var autocomplete = new google.maps.places.Autocomplete(intput);
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']
    );
    var infoWindow = new google.maps.InfoWindow();
}


function goToRent() {
	localStorage.setItem("rent-from",startDateTime.value)
	localStorage.setItem("rent-to",endDateTime.value)
	window.location.href = "/rent"
}


function offsetFromNow(hours){
	var dtNow = Date.now();
	hours -= ((new Date()).getTimezoneOffset()/60);
	return new Date(dtNow + hours * 60 * 60 * 1000);
}


function initDateTimePicker() {
	var dtString = offsetFromNow(6);
	startDateTime.value = convertISOTimeFormat(dtString);
	var dtString = offsetFromNow(30);
	endDateTime.value = convertISOTimeFormat(dtString);
}

initDateTimePicker();

// initPlaceAutocomplete();
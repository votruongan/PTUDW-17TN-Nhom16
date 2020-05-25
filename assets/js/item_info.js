function initDateTimePicker() {
    $("#datetimepicker").datetimepicker();
    $("#datetimepicker2").datetimepicker();
}

function initPlaceAutocomplete() {
    var input = document.getElementById("pac-input");
    var autocomplete = new google.maps.places.Autocomplete(intput);
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']
    );
    var infoWindow = new google.maps.InfoWindow();
}
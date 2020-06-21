// function initMap() {alert("ok");}

function initMap() {
    var position = { lat: 10.7624176, lng: 106.6820081 }
    var map = new google.maps.Map($("#map:hidden")[0], {
        center: position,
        zoom: 16
    });
    var marker = new google.maps.Marker({
        position: position,
        map: map,
    });
}

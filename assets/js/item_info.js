var url = window.location.href;
var i =url.search('/')
while (i>=0){
	url = url.substr(i+1,url.length-1);
	i=url.search('/')
}


async function init(){
const url1 = "http://localhost:3000" + "/item/id/"+url;	
const response = await fetch(url1, {
	method: 'GET',
});

let r = await response.json();

if (r){
	console.log(r.name)
		nameStuff.innerHTML = r.name;
	if (r.star== undefined){
		starStuff.innerHTML = "0/5"
		starStuff.size=15;
	}
	else {
		starStuff.innerHTML = r.star;
	}
	if (r.hiring == undefined){
		hiring.innerHTML="(0 lượt cho thuê)";
	}
	else hiring.innerHTML = "(" + r.hiring+ "lượt cho thuê)";
	cost.innerHTML = r.cost;
	if (r.path!=undefined&& r.path!=null&&r.path!=''){
		console.log(r.path);
		const url = "http://localhost:3000/" +r.path;	
		imageStuff = document.getElementById("imageStuff");
		console.log(imageStuff)
		imageStuff.src = url; 
	}
	userName.innerHTML = r.userName;
	if (r.userHiring!=undefined){
		userHiring.innerHTML=r.userHiring+ "lượt thuê";
	}
	else userHiring.innerHTML= "0 lượt thuê"
	}
	if(r.describe!=undefined&&r.describe!='')
		describe.innerHTML = r.describe;
	else describe.innerHTML=""
	sale.innerHTML = r.cost*5/100 +'k';
}
init();


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
var url = window.location.href;
var i =url.search('/')
while (i>=0){
	url = url.substr(i+1,url.length-1);
	i=url.search('/')
}

let rObject = null;

async function init(){
	const url1 = "/item/id/"+url;	
	const response = await fetch(url1, {
		method: 'GET',
	});

	let r = await response.json();

	if (r){
		rObject = r;
		nameStuff.innerHTML = r.name;
		starStuff.innerHTML = r.star + "/5";
		starStuff.size = 25
		nuRentTimes.innerHTML = "(" + r.nuRentTimes+ " lượt cho thuê)";
		const rcost = r.cost.split('').reverse();
		if (rcost.length > 3)
			rcost.splice(3,0,'.')
		if (rcost.length > 7)
			rcost.splice(7,0,'.')
		r.cost = rcost.reverse().join('');	
		cost.innerHTML = r.cost;
		if (r.path!=undefined&& r.path!=null&&r.path!=''){
			console.log(r.path);
			const url =  r.path;	
			for(var i=0;i<r.path.length;i++){
				var li = document.createElement('li');
				li.setAttribute("data-slide-to",i);
				li.setAttribute("data-target","#imageCarousel");
				if (i==0) li.className = "active";
				document.getElementById("carousel-indicators").appendChild(li);
				var div = document.createElement('div');
				if (i==0) div.className = "carousel-item active";
				else div.className = "carousel-item";
				var div1 = document.createElement('div');
				div1.className = "d-flex justify-content-center h-100"
				var img = document.createElement('img');
				img.id = "imageStuff";
				img.src = '/'+r.path[i];
				img.className = "d-block";
				img.alt = "..."
				div1.appendChild(img);
				div.appendChild(div1);
				document.getElementById("carousel-inner").appendChild(div);
			}
		}
		console.log(r.category);
		cate.innerHTML = r.category;
		userName.innerHTML = r.userName;
		getEle("pac-input").value = r.address;
		console.log(123)
		console.log(r.avatar)
		if (r.avatar!="" && r.avatar!=null) imgUser.src = "/"+r.avatar;
		else imgUser.src = "https://downloadwap.com/thumbs2/wallpapers/p2/new/15/Y2fLYUjz.jpg"  
		userHiring.innerHTML= "0 lượt thuê"
	}
	if(r.describe!=undefined&&r.describe!='')
		describe.innerHTML = r.describe;
	else describe.innerHTML=""
	sale.innerHTML = r.cost*5/100 +'k';
	var date = new Date(r.create_date);
	atCreate.innerHTML = "Đăng ký " + (date.getMonth()+1) + "/" + date.getFullYear();
	for (var i =0;i<r.services.length;i++){
		if (i!=0) {
			let hr= document.createElement('hr')
			hr.className = "mt-2 mb-3 w-100";
			services.appendChild(hr);
		}
		let b = document.createElement('b');
		b.innerHTML = r.services[i];
		services.appendChild(b);			
	}
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

let itemId = 0;

function goToRent() {
	if (!localStorage.getItem("tudo_email")){
		swal({
            title: "Đăng nhập để tiếp tục",
            text: "Bạn cần đăng nhập để tiếp tục",
            icon: "info",
        })
        .then(confirm => {
			localStorage.setItem("login_redirect","/item/"+rObject.id);
			location.href = "/login"
        })
		return;
	}
	localStorage.setItem("rent-from",startDateTime.value)
	localStorage.setItem("rent-to",endDateTime.value)
	localStorage.setItem("rent-item",rObject.id)
	if (rObject.email == localStorage.getItem("tudo_email")){
		window.location.href = "/lease";
		return;
	}
	window.location.href = "/rent";
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
function searchStuff(){
    var name = search_input.value;
    if (name!=null && name!="" && name !=undefined)
        window.location.href = '/search/'+name;
}

var keypress = document.getElementById("search_input");
keypress.addEventListener("keydown", function(event) {
    if (event.keyCode == 13) {
      searchStuff()
    }
  });
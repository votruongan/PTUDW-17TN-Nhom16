var continueButton = document.getElementById("continueButton");
var backButton = document.getElementById("backButton");
var mapPanel = document.getElementById("chooseMapPanel");
var currentPanel = 0
var panels = document.getElementsByClassName("postObjectPanel");
var formNames = ["basicInfo"];

function toggleCheckbox(element){
	if (element.checked==true) khac.classList.toggle("hidden");
   if (element.checked==false) khac.classList.toggle("hidden");	
};
function basicInfoValidation(){
	var formObj = document.forms[formNames[currentPanel]];
	var res = true;
	for (let key in formObj) {
		try {
			key = parseInt(key);
		} catch (e){
		
		}
		if (!Number.isInteger(key))
			continue;
		var help;
		try{
			help = formObj[key].parentElement.getElementsByClassName("help-block")[0];
		} catch (e){
		
		}
		if (help == undefined)
			continue;
		if (formObj[key].value == ""){
			help.style.display = "block";
			res = false;
		} else{
			help.style.display = "none";			
		}
	}
	return res;
}

var formValidators = [basicInfoValidation];

async function nextPanel(){
	if (currentPanel == 1){
		// post object 
		if (stuffName.value!='' && category.value!=''&& money.value!=''&& phone.value!=''&& address!=''&& describe.value && files !=undefined){
			let path=[];
			if (files){
				const url1 = "http://localhost:3000" + "/images/upload";
				console.log(files);
				for (var i = 0, f; f = files[i]; i++){
					let formData = new FormData();
					formData.append('image', files[i]);
					const response1 = await fetch(url1, {
						method: 'POST',
						body:formData  
					});
					let r1 = await response1.json();
					if (r1['message'] == 'Uploaded image successfully'){
						path.push(r1['image_path']);
					}
				}
			}
			let services=[];
			if (giaoDo.checked) services.push("Giao đồ tận nơi trong 5km đầu tiên");
			if (huongDan.checked) services.push("Hướng dẫn sử dụng");
			if (hoTro.checked) services.push("Hỗ trợ trong quá trình sử dụng");
			if (traDo.checked) services.push("Trả đồ tận nơi");
			if (khac.value!="" && khacCheck.checked) services.push(khac.value);
			let cate;
			if (category.value==1) cate = "Thể thao & dã ngoại";
			if (category.value==2) cate = "Âm thanh & ánh sáng";
			if (category.value==3) cate = "Sách & tài liệu";
			if (category.value==4) cate = "Nội thất & trang trí";
			if (category.value==5) cate = "Thiết bị gia dụng";
			if (category.value==6) cate = "Thời trang";
			if (category.value==7) cate = "Đồ điện tử";
			if (category.value==8) cate = "Nhạc cụ";
			if (category.value==9) cate = "Dụng cụ";
			if (category.value==10) cate = "Dịch vụ";

			let stuff ={
				"name" : stuffName.value,
				"category": cate,
				"money" : money.value,
				"phone" : phone.value,
				"address" : address.value,	
				"path" : path,
				"services":services,
				"describe" :describe.value
			}
			let token = localStorage.getItem("tudo_token");
			let email = localStorage.getItem("tudo_email");
			//console.log(token);
			const url = "http://localhost:3000" + "/item/post";	

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'token' : token,
					'email' : email
				},
				body: JSON.stringify(stuff)
			});

			let r = await response.json();
			console.log(r);
			if (r["id"]==0) {
				swal("Thất bại", "Bạn vui lòng thử lại sau nhé", "error");
			}
			else {
				window.location.href = '/item/'+r["id"];
			}
			return;
		}
	}
	else {
		if (formValidators[currentPanel] != undefined){
			if (!formValidators[currentPanel]()){
				return;
			}
		}
		panels[currentPanel++].style.display = "none";
		panels[currentPanel].style.display = "block ";
		backButton.style.visibility = "visible";
		if (currentPanel+1 == panels.length){
			continueButton.innerHTML = "Đăng bài";
		}
	}
}


function previousPanel(){
	continueButton.innerHTML = "Tiếp tục <i class='fas fa-angle-right'></i>";
	panels[currentPanel--].style.display = "none";
	panels[currentPanel].style.display = "block";
	if (currentPanel == 0){
		backButton.style.visibility = "hidden";
	}
}

function openChooseLocationPanel(){
	mapPanel.classList.add("focus");
}
function cancelChooseLocationPanel(){
	mapPanel.classList.remove("focus");
}

function chooseLocation(){
	mapPanel.classList.remove("focus");
	var formObj = document.forms[formNames[currentPanel]];
	formObj["address"].value = document.getElementById("mapAddress").innerHTML;
}

function initPage(){
	var arr = document.getElementsByClassName("help-block");
	var i = 0;
	for (i = 0; i < arr.length; i++){
		arr[i].style.display = "none";
	}
	
	continueButton.onclick=nextPanel;
	backButton.style.visibility = "hidden";
	backButton.onclick = previousPanel;
	
	// set the map button
	document.getElementById("openMapButton").onclick = openChooseLocationPanel;
	document.getElementById("cancelMapButton").onclick = cancelChooseLocationPanel;
	document.getElementById("chooseMapButton").onclick = chooseLocation;
}

function initMap() {
    var position = { lat: 10.7624176, lng: 106.6820081 }
    var map = new google.maps.Map(document.getElementById("map"), {
        center: position,
        zoom: 16
    });
    
	var geocoder = new google.maps.Geocoder();

google.maps.event.addListener(map, 'click', function(event) {
  geocoder.geocode({
    'latLng': event.latLng
  }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
		console.log(results[0].formatted_address);
		var temp = document.getElementById("mapAddress");
		temp.innerHTML =  results[0].formatted_address;
      }
    }
  });
});
}

initPage();

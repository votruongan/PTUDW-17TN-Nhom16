var continueButton = document.getElementById("continueButton");
var backButton = document.getElementById("backButton");
var mapPanel = document.getElementById("chooseMapPanel");
var currentPanel = 0
var panels = document.getElementsByClassName("postObjectPanel");
var formNames = ["basicInfo"];

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

function nextPanel(){
	if (currentPanel+1 == panels.length){
		// post object 
		window.location.href = 'info';
		return;
	}
	if (formValidators[currentPanel] != undefined){
		if (!formValidators[currentPanel]()){
			return;
		}
	}
	panels[currentPanel++].style.display = "none";
	panels[currentPanel].style.display = "block";
	backButton.style.visibility = "visible";
	if (currentPanel+1 == panels.length){
		continueButton.innerHTML = "Đăng bài";
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
	continueButton.onclick = nextPanel;
	backButton.style.visibility = "hidden";
	backButton.onclick = previousPanel;
	
	// set the map button
	document.getElementById("openMapButton").onclick = openChooseLocationPanel;
	document.getElementById("cancelMapButton").onclick = cancelChooseLocationPanel;
	document.getElementById("chooseMapButton").onclick = chooseLocation;
}


initPage();

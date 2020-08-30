
const rentData = {userId:123}
const maxStage = 4

const itemId = 2810
rentData.userId = localStorage.getItem("tudo_email");
rentData.token = localStorage.getItem("tudo_token");
itemId = localStorage.getItem("rent-item");

let fetchResultPrefix = 'result-rent-item'

//check if redirected from item page -> get from and to datetime
const rentDateTime = {from:localStorage.getItem("rent-from"),to:localStorage.getItem("rent-to")}

let allData = null;
const waitingPanelOffset = [-1,0,0,0,0,0];
function setRentDateTime(timeEle, dateEle, data){
	timeEle.innerText = data.substr(11,5);
	dateEle.innerText = `${data.substr(8,2)}/${data.substr(5,2)}/${data.substr(0,4)}`;
}

function updateDateTime(){
	console.log(rentDateTime);
	setRentDateTime(fromTime,fromDate,rentDateTime.from)
	setRentDateTime(toTime,toDate,rentDateTime.to)
}

if (!rentDateTime.from || !rentDateTime.to){
	console.log("not redirected from item page");
} else {
	updateDateTime();
}

async function fetchRentDateTime(){
	const obj = await makeRequest(`rent-date-time/${itemId}`,rentData)
	allData = obj;
	console.log("fetchRentDateTime", obj)
	if (!obj.fromDateTime) return;
	rentDateTime.from = obj.fromDateTime;
	rentDateTime.to = obj.toDateTime;
	updateDateTime();
}
fetchRentDateTime();

async function updateStatus(){
	for (let i = 5; i > 0; i--) {
		const obj = await makeRequest(`${fetchResultPrefix}/${i}/${itemId}`,rentData)
		console.log("updateRentingStatus",i,obj);
		if (obj.status == null || obj.status == "failed"){
			console.log("obj is null");
			continue;
		} else {;
		}
		await fetchRentDateTime();
		if (i == 4)
			if (obj.status == "waiting")
				return openPanel(4,"succceed");
			else 
				return openPanel(5,"succeed");
		if (i < maxStage)
			return openPanel(i+1,obj.status);
		else
			return openPanel(i,obj.status);
	}
	return openPanel(1);
}

function openPanel(index,status="succeed"){
	index--;
	console.log("openning panel",index);
	for (let i = 0; i < 4; i++) {
		try{
			setObjectVisiblity(getEle("panel"+i),false);
		} catch {}
		try{
			setObjectVisiblity(getEle("waitingPanel"+i),false);
		} catch {}
	}
	let panelPrefix = "panel"
	if (status=="waiting"){
		// index+=waitingPanelOffset[index-1];
		index--;
		panelPrefix = "waitingPanel"
	}
	console.log("setting object visibility",panelPrefix+index)
	setObjectVisiblity(getEle(panelPrefix+index),true);
	processPanel(index);
	const sn = document.getElementsByClassName("stepNav");
	for (let i = 1; i < sn.length; i++) {
		sn[i].classList.remove("active");
		if (i == index+1)
			sn[i].classList.add("active");
	}
}

let changeRequestObj = null;
let pageFetchMessage = null;

function makeFetchChangeRequest(){
	if (!pageFetchMessage)
		pageFetchMessage = setInterval(()=>processPanel(3),200)
}
function removeFetchChangeRequest(){
	if (pageFetchMessage){
		clearInterval(pageFetchMessage)
		pageFetchMessage = null;
	}
}


async function processPanel(index){
	switch(index){
		case 0:
			rentRequestmessage.value = allData.requestMessage;
			break;
		case 3:
			if (new Date(rentDateTime.to).getTime() > Date.now()){
				setObjectVisiblity(blockReceiveItem,false);
				//check whether user send any change request
				const res = await makeRequest("result-request-change-rent/"+itemId,rentData);
				console.log("change request fetch",res);
				if (res.isAccepted && res.isAccepted == "waiting"){
					changeRequestObj = res;
					setObjectVisiblity(notiRequestPanel,true);
					setObjectVisiblity(btnReceiveMain,true);
					console.log("setting btnReceiveMain to true");
				} else {
					setObjectVisiblity(btnReceiveMain,false);
					setObjectVisiblity(notiRequestPanel,false);
				}
				makeFetchChangeRequest();
				return
			}
			// enough time has passed
			removeFetchChangeRequest()
			btnReceiveMain.innerHTML = "Đã nhận lại đồ"
			btnReceiveMain.onclick = onReceiveItem;
			break;
	}
}



async function onHandleRentRequest(isAccepted){
	rentData.isAccepted = isAccepted;
	let r = await makeRequest("lease-item/1/"+itemId,rentData)
	console.log(r);
	updateStatus();
}

async function onSendItem(){
	//convert each image file to base64
	const base64Images = await prepareBase64ImageArray(fileSendItem.files);
	rentData.images = base64Images.images;
	rentData.extensions = base64Images.extensions;
	let r = await makeRequest("lease-item/2/"+itemId,rentData)
	console.log(r);
	updateStatus();
}
async function onOpenChangeRequest(){
	setObjectVisiblity(blockChangeRequest,true)
	inputReturnDateTime.value = rentDateTime.to;
	inputReturnDateTime.value = changeRequestObj.changeEndTime;
	inputReturnMethod.value = changeRequestObj.changeReturnMethod;
	inputReturnAddress.value = changeRequestObj.changeReturnAddress;
}

async function handleChangeRequest(value){
	rentData.isAccepted = value;
	let r = await makeRequest("lease-item/3/"+itemId,rentData)
	setObjectVisiblity(blockChangeRequest,false)
	console.log(r);
	setTimeout(()=>updateStatus(),100);
}

async function onReceiveItem(){
	//convert each image file to base64
	const base64Images = await prepareBase64ImageArray(fileSendItem.files);
	rentData.images = base64Images.images;
	rentData.extensions = base64Images.extensions;
	let r = await makeRequest("lease-item/4/"+itemId,rentData)
	console.log(r);
	updateStatus();
}

async function onSendComment(){
	rentData.rating = 0;
	for (let i = 4; i > -1; i--) {
		const ele = getEle("starButton-"+i);
		if (ele.classList.contains("pinned")){
			rentData.rating = i+1;
			break;
		}
	}
	rentData.comment = inputComment.value
	console.log(rentData);
	let r = await makeRequest("lease-item/5/"+itemId,rentData);
	console.log(r);
}


btnReceiveMain.onclick = onOpenChangeRequest;

updateStatus();
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

const rentData = {userId:123}
const maxStage = 4

const itemId = 2810

let fetchResultPrefix = 'result-rent-item'

//check if redirected from item page -> get from and to datetime
const rentDateTime = {from:localStorage.getItem("rent-from"),to:localStorage.getItem("rent-to")}

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
	console.log("fetchRentDateTime", obj)
	if (!obj.fromDateTime) return;
	rentDateTime.from = obj.fromDateTime;
	rentDateTime.to = obj.toDateTime;
	updateDateTime();
}
fetchRentDateTime();

async function updateStatus(){
	for (let i = 4; i > 0; i--) {
		console.log("interating",i,fetchResultPrefix,rentData)
		const obj = await makeRequest(`${fetchResultPrefix}/${i}/${itemId}`,rentData)
		console.log("updateRentingStatus",obj);
		if (obj.status == null || obj.status == "failed"){
			console.log("obj is null");
			continue;
		} else {;
		}
		fetchRentDateTime();
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

let changeRequestObj = null

async function processPanel(index){
	switch(index){
		case 3:
			if (new Date(rentDateTime.to).getTime() > Date.now()){
				setObjectVisiblity(blockReturnItem,false);
				btnReturnMain.innerText = "Yêu cầu thay đổi"
				const res = await makeRequest("result-request-change-rent/"+itemId,rentData);
				console.log("change request fetch",res);
				if (res.isAccepted && res.isAccepted == "waiting"){
					changeRequestObj = res;
					btnReturnMain.innerText = "Xem lại yêu cầu"
					setObjectVisiblity(notiRequestPanel,true);
				}
			}
			break;
	}
}


async function onSendBookingRequest(){
	rentData.message = requestMessage.value;
	rentData.fromDateTime = rentDateTime.from;
	rentData.toDateTime = rentDateTime.to;
	let r = await makeRequest("rent-item/1/"+itemId,rentData)
	console.log(r);
	updateStatus();
}


async function onCompleteDeposit(){
	rentData.method = "credit";
	rentData.card = inputCardId.value;
	rentData.ccv = inputCCV.value;
	rentData.expireDate = inputExpire.value;
	let r = await makeRequest("rent-item/2/"+itemId,rentData)
	console.log(r);
	updateStatus();
}

async function onReceiveItem(){
	//convert each image file to base64
	const base64Images = await prepareBase64ImageArray(fileReceiveItem.files);
	rentData.images = base64Images.images;
	rentData.extensions = base64Images.extensions;
	let r = await makeRequest("rent-item/3/"+itemId,rentData)
	console.log(r);
	updateStatus();
}

async function changeEndDateTime(){
	const endDate = new Date(inputReturnDateTime.value);
	const duration = (endDate - new Date(rentDateTime.from))/(60*60*1000);
	const noDay = math.ceil(duration / 24);
	
}

async function makeRequestChange(){
	const dati = inputReturnDateTime.value;
	const meto = inputReturnMethod.value;
	const addr = inputReturnAddress.value;
	if (!dati || !meto || !addr){
		setObjectVisiblity(notiRequestCheck,true);
		notiRequestCheck.innerHTML = "Không có gì thay đổi nên không thể gửi yêu cầu";
	}
	rentData.endDateTime = dati;
	rentData.returnMethod = meto;
	rentData.returnAddress = addr;
	// return console.log(rentData);
	let r = await makeRequest("rent-item/4/"+itemId,rentData);
	console.log(r);
	closeRequestChange();
	updateStatus();
}

async function closeRequestChange(){
	setObjectVisiblity(requestChangeReturn,false);
	setObjectVisiblity(notiRequestCheck,false);
	setObjectVisiblity(btnSendChangeRequest,true);	
}
async function onRequestChange(){
	setObjectVisiblity(requestChangeReturn,true)
	inputReturnDateTime.value = rentDateTime.to;
	btnSendChangeRequest.innerHTML = "Gửi yêu cầu thay đổi"
	if (changeRequestObj){
		inputReturnDateTime.value = changeRequestObj.changeEndTime;
		inputReturnMethod.value = changeRequestObj.changeReturnMethod;
		inputReturnAddress.value = changeRequestObj.changeReturnAddress;
		btnCloseChangeRequest.innerHTML = "Đóng";
		setObjectVisiblity(btnSendChangeRequest,false);
	}
}

sendBookingRequest.onclick = onSendBookingRequest;
completeDeposit.onclick = onCompleteDeposit;
btnRecievedItem.onclick = onReceiveItem;
btnReturnMain.onclick = onRequestChange;
btnSendChangeRequest.onclick = makeRequestChange;
updateStatus();

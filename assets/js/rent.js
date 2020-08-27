
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
		panelPrefix = "waitingPanel"
	}
	console.log("setting object visibility",panelPrefix+index)
	setObjectVisiblity(getEle(panelPrefix+index),true);
	const sn = document.getElementsByClassName("stepNav");
	for (let i = 1; i < sn.length; i++) {
		sn[i].classList.remove("active");
		if (i == index+1)
			sn[i].classList.add("active");
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
	let r = await makeRequest("rent-item/3/"+itemId,rentData)
	console.log(r);
	updateStatus();
}

async function onReturnItem(){
	let r = await makeRequest("rent-item/4/"+itemId,rentData)
	console.log(r);
	updateStatus();
}

sendBookingRequest.onclick = onSendBookingRequest;
completeDeposit.onclick = onCompleteDeposit;
btnRecievedItem.onclick = onReceiveItem;
btnReturnedItem.onclick = onReturnItem;
updateStatus();


const rentData = {userId:123}
const maxStage = 4

const itemId = 2810

const fetchResultPrefix = 'result-lease-item'

async function updateStatus(){
	for (let i = 4; i > 0; i--) {
		const obj = await makeRequest(`${fetchResultPrefix}/${i}/${itemId}`,rentData)
		console.log("updateRentingStatus",);
		if (obj == null || (Object.keys(obj).length === 0 && obj.constructor === Object) || obj ==""){
			console.log("obj is null");
			continue;
		}
		if (i < maxStage)
			return openPanel(i+1);
		else
			return openPanel(i);
	}
	console.log(fetchResultPrefix);
	return openPanel(1);
}

function openPanel(index){
	index--;
	console.log("openning panel",index);
	for (let i = 0; i < 4; i++) {
		setObjectVisiblity(getEle("panel"+i),false);
	}
	setObjectVisiblity(getEle("panel"+index),true);
	const sn = document.getElementsByClassName("stepNav");
	for (let i = 1; i < sn.length; i++) {
		sn[i].classList.remove("active");
		if (i == index+1)
			sn[i].classList.add("active");
	}
}


async function onSendBookingRequest(){
	rentData.message = requestMessage.value;
	let r = await makeRequest("rent-item/1/"+itemId,rentData)
	console.log(r);
	updateStatus();
}


async function onCompleteDeposit(){
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

updateStatus();
sendBookingRequest.onclick = onSendBookingRequest;
completeDeposit.onclick = onCompleteDeposit;
btnRecievedItem.onclick = onReceiveItem;
btnReturnedItem.onclick = onReturnItem;
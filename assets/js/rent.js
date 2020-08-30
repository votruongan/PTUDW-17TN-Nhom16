
const rentData = {userId:123}
const maxStage = 5

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
	for (let i = 5; i > 0; i--) {
		console.log("interating",i,fetchResultPrefix,rentData)
		const obj = await makeRequest(`${fetchResultPrefix}/${i}/${itemId}`,rentData)
		console.log("updateRentingStatus",i,obj);
		if (obj.status == null || obj.status == "failed"){
			console.log("obj is null");
			continue;
		} else {;
		}
		fetchRentDateTime();
		if (i < 4)
			return openPanel(i+1,obj.status);
		else
			return openPanel(i+1,"succeed");
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
	if (index > 4)
	sn[index].classList.add("active");
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
				return;
			}
			// renting time is up. Open return panel
			btnReturnMain.onclick = onReturnItem;
			break;
		case 4:
			setObjectVisiblity(panel1,true);
			btnCompletePayment.innerHTML = "Hoàn tất tiền thuê"
			btnCompletePayment.onclick = makeFinishPayment;
			setObjectVisiblity(btnCancelPayment,false)
			paymentDescription.innerHTML = "Thanh toán tiền thuê:"
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


const paymentObject = {method:"credit"}

function changePaymentMethod(method){
    paymentObject.method = method;
}

async function onCompleteDeposit(){
	const m =paymentObject.method
	rentData.method = m;
	if (m == "credit");
	{
		rentData.card = inputCardNumber.value;
		rentData.ccv = inputCCV.value;
		rentData.expireDate = inputExpire.value;
	}
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

async function onReturnItem(){
	//convert each image file to base64
	const base64Images = await prepareBase64ImageArray(fileReturnItem.files);
	rentData.images = base64Images.images;
	rentData.extensions = base64Images.extensions;
	let r = await makeRequest("rent-item/5/"+itemId,rentData)
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

function preparePaymentRentDataObject(){
	rentData.method = undefined;
	const n = inputCardNumber.value;
	const c = inputCCV.value;
	const e = inputExpire.value;
	if (paymentObject.method == "credit"){
		if (!n || !c || !e){
			return;
		}
		rentData.card = n;
		rentData.ccv = c;
		rentData.expireDate = e;
	}
	rentData.method = paymentObject.method;

}

async function makeFinishPayment(){
	preparePaymentRentDataObject();
	// return console.log(rentData);
	if (!rentData.method){
		return;
	}
	let r = await makeRequest("rent-item/6/"+itemId,rentData);
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
	let r = await makeRequest("rent-item/7/"+itemId,rentData);
	console.log(r);
	location.href = location.host + "/item"
}

function reformatCreditExpireDate(){
	if (this.value.length > 3){
		if (!isNaN(this.value))
			this.value = this.value.substr(0,2) +"/"+this.value.substr(2,2)
	}
	if (this.value.length > 4){
		this.value = this.value.substr(0,2) +"/"+this.value.substr(3,2)
	}
}


inputExpire.oninput = reformatCreditExpireDate;
inputExpire.maxLength = 5;
sendBookingRequest.onclick = onSendBookingRequest;
btnCompletePayment.onclick = onCompleteDeposit;
btnRecievedItem.onclick = onReceiveItem;
btnReturnMain.onclick = onRequestChange;
btnSendChangeRequest.onclick = makeRequestChange;
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
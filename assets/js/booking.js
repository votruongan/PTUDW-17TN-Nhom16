

sendBookingRequest.onclick = ()=>{
	let x = postXHR("book-item","1/1")
	const obj = {}
	obj.userId = 123;
	obj.message = requestMessage.value;
	x.send(makeFormData(obj));
}


// FIT - HCMUS - 1712266 - Vo Truong An - simple font-end template engine

// usage: define a template, use $+<number> to denotes index in params array
// example:
// 		t = "<div>$0</div>"
//		p = ["foo"]
//		templateImplement(t,p)
// output: <div>foo</div>

var ReloadNeedsConfirm = false;

let urlPrefix = window.location.host + "/";

function makeRequest(path,postObject = null){
	if (postObject)
		return fetch(path,{
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postObject)
		}).then(val => {
			return val.json();
		})
	//no object to post -> get method
	return fetch(path).then(val => val.json());
}

function getXHR(toSend,param=null){
    url =  toSend;
    if (param != null)
        url = url + "/" + param.toString();
    let xhr = new XMLHttpRequest();
    xhr.open("GET",url);
    return xhr;
}

function convertISOTimeFormat(input){
	return input.toISOString().slice(0,19);
}

function postXHR(toSend,param=null){
    url =  toSend;
    if (param != null)
        url = url + "/" + param.toString();
    let xhr = new XMLHttpRequest();
    xhr.open("POST",url,true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    return xhr;
}

function makeFormData(obj){
	let str = ""
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const ele = obj[key];
			str += key+"="+ele+ "&";
		}
	}
	return str.substr(0,str.length-1);
}

// function templateImplement(template,params,isArrayOfParams=false){
// 	var i = 0, len = params.length,j;
// 	var res = []; var tmp;
// 	if (isArrayOfParams){
// 		var pArr = [];
// 		for (i = 0; i < len; i++){
// 			pArr.push(params[i][j]);
// 		}	
// 		return res;
// 	}
// 	for (i = 0; i < len; i++){
// 		res.push(execImplement(template,0,params[i]));
// 	}
// 	return res;
// }

// function deArrayToElements(arr){
// 	var res = []; var len = arr.length;
// 	var tmp,j,i,k;
// 	tmp = arr.splice(0);
// 	for (i = 0; i < len-1; i++){
// 		tmp = expandArray(tmp,i)
// 		for (j = 0; j < tmp.length; j++){
// 			var det = expandArray(tmp[j],i+1);
// 			if (det == undefined)
// 			{
// 				console.log(tmp);
// 				console.log(j + " - " +i);
// 				continue;
// 			}
// 			for (k = 0; k < det.length; k++){
// 				res.push(expandArray(tmp[j],i+1));
// 			}
// 		}
// 	}
// 	return res;
// }

// function expandArray(arr,index){
// 	if (!Array.isArray(arr[index]))
// 		return;
// 	var res = []; var len = arr[index].length;
// 	var i =0;
// 	for (i=0;i < len;i++){
// 		res.push(arr.slice(0));
// 		res[i][index] = arr[index][i];
// 	}
// 	return res;
// }


// function execImplement(template,index,str){
// 	tmp = "$" + index;
// 	return template.replace(tmp,str);
// }



//INIT Page
var choosedStarButton = 0;
var starButtonArray;
function activateStarButton(addingClass="active"){
	if (typeof addingClass != 'string')
		addingClass = "active";
	var starIndex = parseInt(this.id.split("-")[1]);
	for (var i = 0; i < starIndex; i++){
		starButtonArray[i].classList.add(addingClass);
	}
}
function resetStarButton(removingClass="active"){
	if (typeof removingClass != 'string')
		removingClass = "active";
	for (let ele of starButtonArray){
		ele.classList.remove(removingClass);
	}
}
function setStarButton(){
	var starIndex = parseInt(this.id.split("-")[1]);
	resetStarButton("active");
	resetStarButton("pinned");
	for (var i = 0; i <= starIndex; i++){
		starButtonArray[i].classList.add("pinned");
	}
}

function basePageInit(){
	var arr = document.getElementsByClassName("backButton");
	for (let ele of arr){
		ele.onclick = function(){ window.history.back()};
	}
	// for (i = 0; i < 10; i++){
	// 	var e = document.getElementById("panel"+i);
	// 	if (e == null || e == undefined)
	// 		continue;
	// 	e.classList.add("d-none");
	// 	e.classList.add("d-block");
	// 	if (i == 0){
	// 		e.classList.remove("d-none");
	// 	} else {
	// 		e.classList.remove("d-block");			
	// 	}
	// }
	starButtonArray = document.getElementsByClassName("star-button");
	for (i = 0; i < starButtonArray.length; i++){
		starButtonArray[i].id = "starButton-"+i;
		starButtonArray[i].onmouseover = activateStarButton;
		starButtonArray[i].onmouseout = resetStarButton;
		starButtonArray[i].onclick = setStarButton;
	}
	
}


//base64Images object: {images: array of string of all images, extensions: array of extension of images},
// input: files value of <input type="file"> element
async function prepareBase64ImageArray(files){
	const file64 = [];
	const ext = [];
	console.log(files);
	for (let i = 0; i < files.length; i++) {
		const f = files[i];
		const bytes = new Uint8Array(await f.arrayBuffer());
		let binary = '';
		for (let j = 0; j < bytes.byteLength; j++) {
			binary += String.fromCharCode(bytes[j]);
		}
		file64.push(window.btoa(binary));
		ext.push(f.type.split("/")[1]);
	}
	const res = {};
	res.images = file64;
	res.extensions = ext;
	return res;
}

window.onbeforeunload = function() {
	if (ReloadNeedsConfirm)
		return 'Mốt số thay đổi vẫn chưa được lưu lại :/ bạn có chắc chắn muốn rời đi chứ';
};

basePageInit();



function extendNavBar(){
	$("#toggleNavBar").children()[0].classList.remove("fa-bars");
	$("#toggleNavBar").children()[0].classList.add("fa-angle-up");
	$("#toggleNavBar").attr("onclick","reduceNavBar()");
	$("#moreNav").removeClass();
	$("#moreNav").children().addClass("col-12");
}


function reduceNavBar(){
	$("#toggleNavBar").children()[0].classList.remove("fa-angle-up");
	$("#toggleNavBar").children()[0].classList.add("fa-bars");
	$("#toggleNavBar").attr("onclick","extendNavBar()");
	$("#moreNav").addClass("d-none navbar-brand d-lg-block");
	$("#moreNav").children().removeClass("col-12");
}

function toggleClassList(target,classString){
	classString.split(" ").forEach(val=>{
		target.classList.toggle(val)
	})
}

if (typeof showDetailButton != "undefined")
	showDetailButton.onclick = () => {
		detailPanel.classList.toggle("d-none")
		toggleClassList(detailPanel,"focus overlay bg-white position-absolute")
		detailPanel.style.height = "950px"
		if (detailPanel.classList.contains("d-none")) return showDetailButton.innerText = "Chi tiết tiền thuê"
		showDetailButton.innerText = "Quay lại"
	}



function getEle(id){
    return document.getElementById(id);
}

function grandParent(ele){
  return ele.parentNode.parentNode;
}

function takeGrandParentHeightPx(ele){
    let raw = grandParent(ele).style.height;
    raw.substring(0,raw.length-3);
    return parseInt(raw);
}

function changeTab(addActive, removeActive,enableEle, disableEle){
	// console.log(removeActive, removeActive.classList);
	removeActive.classList.remove("active");
	getEle(addActive).classList.add("active");
	setObjectVisiblity(disableEle,false)
	setObjectVisiblity(enableEle,true)
}

function setObjectVisiblity(obj, value, visibleClass="d-block"){
  if (value) {
      obj.classList.remove("d-none");
      obj.classList.add(visibleClass);
      return;
  }
  obj.classList.remove(visibleClass);
  obj.classList.add("d-none");
}

function setObjectActive(obj, value){
  if (value) obj.removeAttribute("disabled")
  else obj.setAttribute("disabled","true")
}


/*
	Account Authenciation
*/


async function autoLoginWithToken() {
    let urlParamms = new URLSearchParams(window.location.search);
    let token = urlParamms.get('token');
    let email = urlParamms.get('email');

    console.log(token);

    if (!token || !email) {
        email = localStorage.getItem("tudo_email");
        token = localStorage.getItem("tudo_token");

        if (email == "" || token == "") {
            return;
        }
    }

    let user = {
        "email": email,
        "token": token
    }

    const url = "http://"+location.host+  "/auth_by_token/";

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    
    let r = await response.json();
    console.log(r);

    if (r) {
        // Get user info if this token is valid
        let userInfo = await getUserInfo(email, token);
        console.log("User info = ", userInfo);

        if (userInfo.length > 0) {
            navBtnLogIn.innerText = userInfo[0].name;
            navBtnLogIn.href = "#"
            navBtnSignUp.style.display = 'none';
            if (userInfo[0].avatar && userInfo[0].avatar != "")
                navBtnAvatar.src = '/' + userInfo[0].avatar;
        }
    }
}

async function getUserInfo(email) {
    let user = {
        "email": email
    };

    const url = "/get_user_info/";

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    let r = await response.json();

    return r;
}

async function logOutOnClick() {
    let urlParamms = new URLSearchParams(window.location.search);
    let email = urlParamms.get('email');

    if (!email) {
        email = localStorage.getItem("tudo_email");

        if (email == "") {
            return;
        }
    }

    let user = {
        "email": email
    }

    const url = "/log_out/";

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    let r = await response.json();

    swal({
        title: "Thành công",
        text: "Đăng xuất thành công",
        icon: "success",
    })
    .then(confirm => {
        if (confirm) {
            localStorage.removeItem("tudo_email");
            localStorage.removeItem("tudo_token");

            // Navigate to home page
            window.location.href = "";
        }
    })
}

async function profileOnClick() {
	console.log("Profile On Click")

	let email = localStorage.getItem("tudo_email");
	let token = localStorage.getItem("tudo_token");

	let user = {
        "email": email,
        "token": token
    }

    const url = "/auth_by_token/";

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    let r = await response.json();
    console.log("Authen result = ", r);

    if (r) {
        window.location.href = "/profile"
	}
}

// Activate 

autoLoginWithToken()
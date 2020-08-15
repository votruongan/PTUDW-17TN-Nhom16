// FIT - HCMUS - 1712266 - Vo Truong An - simple font-end template engine

// usage: define a template, use $+<number> to denotes index in params array
// example:
// 		t = "<div>$0</div>"
//		p = ["foo"]
//		templateImplement(t,p)
// output: <div>foo</div>

var ReloadNeedsConfirm = false;


function getXHR(toSend,param=null){
    url =  toSend;
    if (param != null)
        url = url + "/" + param.toString();
    let xhr = new XMLHttpRequest();
    xhr.open("GET",url);
    return xhr;
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
		toggleClassList(detailPanel,"d-block overlay bg-white p-5 position-absolute")
		if (detailPanel.classList.contains("d-none")) return showDetailButton.innerText = "Chi tiết tiền thuê"
		showDetailButton.innerText = "Quay lại"
	}
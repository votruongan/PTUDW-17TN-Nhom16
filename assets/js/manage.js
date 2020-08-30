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
function create(htmlStr) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
  }
  return frag;
}
async function init(){
  const url1 = "http://localhost:3000" + "/manage/info";	
  let token = localStorage.getItem("tudo_token");
	let email = localStorage.getItem("tudo_email");
	const response = await fetch(url1, {
    method: 'GET',
    headers: {
      'token' : token,
      'email' : email
    }
	});
	let r = await response.json();

	if (r[0]){
    console.log(r);
    for(var i =0 ;i<r.length;i++){
      if (r.status == 0 || r.status == undefined || r.status == null){
        var service='';
        for (var j=0;j<r[i].services.length;j++){
            service = service+ r[i].services[j]+'. ';
        }
        var fragment = create('<div class="mystuff row justify-content-left" style="margin-top: 10px;"><div class="imgstuff col-xs-12 col-sm-12 col-md-4 col-lg-6" style="text-align: -webkit-right;right: 55px"><div class="imagestuff" style="margin-right: 24px"><img id="main" src="'+r[i].path[0]+'" alt=""><img id="heart" src="img/heart.png" alt="" /><div class="phithue">'+r[i].cost+'k/ngày </div><div class="tinhtrang"><div class="tentinhtrang"> <span class="daucham" style="background: green;"></span> Đang rảnh</div></div></div></div><div class="allinfostuff col-xs-12 col-sm-12 col-md-4 col-lg-6" style="align-self:center;transform: translateX(-95px)"><div class="infostuff" style="margin-left: 24px; display:inline-grid"><div class="stuffname" style="font-weight: bold;font-size: 25px;display: inline-flex;width: 500px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+r[i].name+'</div><div class="danhmuc d-inline-flex" style="font-weight: bold;font-size: 20px;">Danh mục:<div class="tendanhmuc" style="font-weight: normal; margin-left: 5px;">'+r[i].category+'</div></div><div class="saovathue d-inline-flex" style="margin-top: 5px;"><div class="saosanpham">'+r[i].star+'/5</div><img id="star" src="img/star.png" alt="" style="width: 30px;margin-left: 5px;"><div class="solanthue" style="margin-left: 5px;">(' + r[i].nuRentTimes + ' lượt cho thuê)</div></div><strong class="d-inline-flex">Số điện thoại liên hệ:<div class="sdtlienhe"style="font-weight: normal; margin-left: 5px;" >'+r[i].phone+'</div></strong><strong class="d-inline-flex"style="flex-flow: column;">Dịch vụ kèm theo:<div class="timeto"style="font-weight: normal; margin-left: 5px;width: 500px;height: 26px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;" >'+service+'</div></strong><strong style="flex-flow: column;" class="d-inline-flex">Địa chỉ nhận, trả đồ:<p class="diachinhantra" style="margin-bottom: 0px;font-weight: normal; margin-left: 10px;width: 500px;font-size: 15px; width: 500px;height: 26px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+r[i].address+'</p></strong><button type="submit" class="Editstuff btn btn-success" style="width: 150px;top:48px;right: 25px;position: absolute;">Chỉnh sửa</button></div></div></div>')
        document.getElementById("container").appendChild(fragment);
      }
      else {
        const url2 = "http://localhost:3000" + "/renter/info";	
        const response1 = await fetch(url2, {
          method: 'GET',
          headers: {
            'email' : r[i].email
          }
        });
        let r1 = await response1.json();
        var date1 = new Date(r[i].rentDateFrom)
        var from = date1.getDate() +"/" +(date1.getMonth()+1) +'/'+(date1.getFullYear());
        var date2 = new Date(r[i].rentDateTo)
        var to = date2.getDate() +"/" +(date2.getMonth()+1) +'/'+(date2.getFullYear());
        var soNgay = (date2-date1).getDate()+1;
        var date3 = new Date(r1.create_date);
        var day_create = date3.getDate() +"/" +(date3.getMonth()+1) +'/'+(date3.getFullYear()) ;
        var fragment = create('<div class="mystuff row justify-content-left" style="margin-top: 10px;"><div class="imgstuff col-xs-12 col-sm-12 col-md-4 col-lg-4"><div class="imagestuff"><img id="main" src="'+r[i].path[0]+'" alt=""><img id="heart" src="img/heart.png" alt="" /><div class="phithue">'+r[i].cost+'k/ngày</div><div class="tinhtrang"><div class="tentinhtrang"> <span class="daucham"></span> Đang cho thuê</div></div></div></div><div class="allinfostuff col-xs-12 col-sm-12 col-md-4 col-lg-4" style="justify-content:center"><div class="infostuff" style="margin-left: 5px; display:inline-grid"><div class="stuffname" style="font-weight: bold;font-size: 25px;display: inline-flex;">'+r[i].name+'</div><div class="danhmuc d-inline-flex" style="font-weight: bold;font-size: 20px;">Danh mục:<div class="tendanhmuc" style="font-weight: normal; margin-left: 5px;"> '+r[i].category+'</div></div><div class="saovathue d-inline-flex" style="margin-top: 5px;"><div class="saosanpham">'+r[i].star+'/5</div><img id="star" src="img/star.png" alt="" style="width: 30px;margin-left: 5px;"><div class="solanthue" style="margin-left: 5px;">('+r[i].nuRentTimes+' lượt cho thuê)</div></div><div style="font-weight: bold;width: fit-content; display: inline-flex;">Thời gian cho thuê:</div><strong class="d-inline-flex" style="margin-left: 50px;margin-top: 5px;">Từ:<div class="timefrom"style="font-weight: normal; margin-left: 5px;" >'+from+'</div></strong><strong class="d-inline-flex" style="margin-left: 50px;">Đến:<div class="timeto"style="font-weight: normal; margin-left: 5px;" >'+to+'</div></strong><strong style="margin-top:5px;display:inline-block" class="d-inline-flex">Tổng tiền thu nhập:<div class="Tongtienthunhap" style="font-weight: normal; margin-left: 5px;">'+soNgay*r[i].cost+'</div><div style="font-weight: normal; margin-left: 5px;">VNĐ</div></strong></div></div><div class="allrenterinfo col-xs-12 col-sm-12 col-md-4 col-lg-4"><div class="renterinfo"><div style="font-weight: bold;font-size: 22px;">Thông tin người thuê</div><div class="column1" style="width: fit-content; float:left"><div class="rentername" style="font-weight: bold;font-size: 22px;margin-top: 5px;">'+r1.name+'</div><strong class="d-inline-flex" style="font-weight: bold;font-size: 16px;">Ngày đăng ký:<div class="signupdate"style="font-weight: normal; margin-left: 5px;">'+day_create+'</div></strong></div><img src="'+r1.avatar+'" alt="" style="margin-top: 5px; border: 1px solid black; margin-left: 20px;width:55px;height: 55px; border-radius: 100%; object-fit: cover;"><p style="margin-top: 12px;margin-bottom: 0.5rem;font-size: 16px;">XÁC THỰC THÔNG TIN CÁ NHÂN</p><strong style="margin-left: 25px;">Địa chỉ email: <div style="float:right;font-weight: normal;">Đã xác thực <img style="width: 20px;height: 20px;" src="img/Tick.png" alt=""></div></strong><strong style="display: block;margin-left: 25px;">Số điện thoại:<div style="float:right;font-weight: normal;">Đã xác thực <img style="width: 20px;height: 20px;" src="img/Tick.png" alt=""></div></strong><strong style="display: block;margin-left: 25px;">CMND/CCCD:<div style="float:right;font-weight: normal;">Đã xác thực <img style="width: 20px;height: 20px;" src="img/Tick.png" alt=""></div></strong></div></div></div>');
        document.getElementById("container").appendChild(fragment);
      }
    }
  }else {
    document.getElementById("chuaCoStuff").classList.toggle("chuaCoStuff")
        return;
  }
}

init();

var r;
var url = window.location.href;
var i =url.search('/')
while (i>=0){
	url = url.substr(i+1,url.length-1);
	i=url.search('/')
}
async function init(){
    console.log(url);

    const url1 =  "/search/nameStuff/" + url;	
    console.log(url1);
    const response = await fetch(url1, {
	    method: 'GET'
    });
    r = await response.json();
    console.log(r)
    if (r.length===0 || r == false){
        document.getElementById("chuaCoStuff").classList.toggle("stuff1")
        return;
    }
    for (var i=0;i<r.length;i++){
        console.log(i);
        var div1 = document.createElement('div');
        div1.className = "imagestuff"
        var imgMain = document.createElement('img');
        imgMain.id = "main";
        imgMain.className =i
        imgMain.src = ("/" + r[i].path[0]);
        var imgHeart = document.createElement('img');
        imgHeart.src = "/img/heart.png"
        imgHeart.id = "heart"
        var cost = document.createElement('div');
        cost.className = "phithue";
        cost.innerHTML = r[i].cost + 'k/ngày';
        div1.appendChild(imgMain);
        div1.appendChild(imgHeart);
        div1.appendChild(cost);

        var div2 = document.createElement('div');
        div2.className="saovathue";
        var div3 = document.createElement('div');
        div3.className = "saosanpham";
        div3.innerHTML= (r[i].star) + '/5'
        var imgStar = document.createElement('img')
        imgStar.src = "/img/star.png"
        imgStar.id="star"
        var div4 = document.createElement('div');
        div4.className="solanthue";
        div4.innerHTML = '(' + r[i].nuRentTimes + " lượt cho thuê)";
        div2.appendChild(div3);
        div2.appendChild(imgStar);
        div2.appendChild(div4);

        var div5 = document.createElement('div');
        div5.className = 'top';
        var imgStar1 = document.createElement('img');
        imgStar1.src = "/img/badge.png"
        imgStar1.id="star"
        var div6 = document.createElement('div');
        div6.className  = "txttop";
        div6.innerHTML = "Top";
        div5.appendChild(imgStar1);
        div5.appendChild(div6);

        var div7 = document.createElement('div')
        div7.className = "info " + i
        var div8 = document.createElement('div')
        div8.className = "tensanpham";
        div8.innerHTML = r[i].name;
        var div9  = document.createElement('div')
        div9.className = "thuengay"
        div9.innerHTML = "Thuê ngay"
        var div10 = document.createElement('div');
        div10.className = "lienhe"
        div10.innerHTML  = "Liên hệ"
        div7.appendChild(div8)
        div7.appendChild(div2)
        div7.appendChild(div9)
        div7.appendChild(div10)
        div7.appendChild(div5)

        var div11 = document.createElement("div")
        div11.className = "boderstuff"
        div11.id = i
        div11.appendChild(div1)
        div11.appendChild(div7)

        var li1 = document.createElement('li');
        li1.id = i;
        li1.appendChild(div11);
        console.log(li1)
        document.getElementById('stufflist').appendChild(li1)                  
    }
}

init()


  

var startRentTime = document.getElementById("startDateTime");
var endRentTime = document.getElementById("endDateTime");
function convertFormat(input){
	return input.toISOString().slice(0,19);
}

function offsetFromNow(hours){
	var dtNow = Date.now();
	hours -= ((new Date()).getTimezoneOffset()/60);
	return new Date(dtNow + hours * 60 * 60 * 1000);
}


function initDateTimePicker() {
	var dtString = offsetFromNow(6);
	startRentTime.value = convertFormat(dtString);
	var dtString = offsetFromNow(30);
	endRentTime.value = convertFormat(dtString);
}


initDateTimePicker();

var location1 = [ 10.7961258,10.8005535,10.7814843,10.7834544,10.7845533]
var location2 = [ 106.6700673,106.679709,106.680000,106.6750044,106.693422]
var temp=0;
function initMap() {
    var position = { lat: location1[Math.floor(Math.random()*5)], lng: location2[Math.floor(Math.random()*5)] }
    var map = new google.maps.Map(document.getElementById("map"), {
        center: position,
        zoom: 17
    });
    if (temp==1){
        var marker = new google.maps.Marker({
            position: position,
            map: map,
        });
    }
    temp=1;
}

$('.1stuff').click(function(){
    location.href="/info"
})

$(function(){
    $('.btnss').click(function(){
        $('.btnss').removeClass('acctive')
        $(this).addClass('acctive')
    })
    $('ul').hover(function(){
        $('li').hover(function(){
            $('.boderstuff').hover(function(){
                $('div.' + $(this).attr('id')).css('background','rgb(239 239 239)');
                $('img.' + $(this).attr('id')).css({'transform': 'scale(1.1)','transition': '1s'});
                initMap()
            }, function(){
                $('div.' + $(this).attr('id')).css("background", '#ffffff');
                $('img.' + $(this).attr('id')).css('transform', 'none' );
            });
        })
    });
    $('ul').click(function(){
        $('div.boderstuff').click(function(){
            window.location.href = '/item/'+r[$(this).attr('id')].id;
        });
    });
 
})


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

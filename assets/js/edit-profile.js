
async function readUserInfoAndFill() {
    let email = localStorage.getItem("tudo_email");

    if (email == "") {
        return;
    }

    let userInfo = await getUserInfo(email);

    if (userInfo.length > 0) {
        console.log("Userinfo: ", userInfo[0]);

        avatarImg.src = "http://localhost:3000/" + userInfo[0].avatar;
        emailTitle.innerText = userInfo[0].email;
        InputEmail.value = userInfo[0].email;
        InputName.value = userInfo[0].name;
        InputPhone.value = userInfo[0].phone;
        InputLocation.value = userInfo[0].address;
    }
}

function checkStateOfUpdate() {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    console.log("Success = ", success);

    if (success == 1) {
        swal({
            title: "Thành công",
            text: "Cập nhật thông tin thành công",
            icon: "success",
        })
        .then(confirm => {
            if (confirm) {
                // Navigate to profile page
                window.location.href = "http://localhost:3000/profile";
            }
        })

    } else if (success == 0) {
        swal("Thất bại", "Cập nhật thông tin thất bại! Vui lòng thử lại!", "error");
    }
}

$(document).ready(function() {
    var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.avatar').attr('src', e.target.result);
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $(".file-upload").on('change', function(){
        readURL(this);
    });
});

// Activate

readUserInfoAndFill();

checkStateOfUpdate();
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
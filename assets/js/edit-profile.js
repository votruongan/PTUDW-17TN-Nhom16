async function readUserInfoAndFill() {
    let email = localStorage.getItem("tudo_email");

    if (email == "") {
        return;
    }

    let userInfo = await getUserInfo(email);

    if (userInfo.length > 0) {
        console.log("Userinfo: ", userInfo[0]);

        emailTitle.innerText = userInfo[0].email;
        InputName.value = userInfo[0].name;
        InputPhone.value = userInfo[0].phone;
        InputLocation.value = userInfo[0].address;
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

async function SaveButtonTapped() {
    let email = localStorage.getItem("tudo_email");
    let token = localStorage.getItem("tudo_token");

    let name = InputName.value;
    let phone = InputPhone.value;
    let address = InputLocation.value;

    let params = {
        "email" : email,
        "token" : token,
        "name" : name,
        "phone" : phone,
        "address" : address
    }

    console.log("Param = ", params);
    
    const url = "http://localhost:3000" + "/update_info/";

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });

    let r = await response.json();

    console.log("Update Res = ", r);

    if (r.state) {
        swal({
            title: "Thành công",
            text: r.message,
            icon: "success",
        })
        .then(confirm => {
            if (confirm) {
                // Navigate to profile page
                window.location.href = "http://localhost:3000/profile";
            }
        })

    } else {
        swal("Thất bại", r.message, "error");
    }
}

// Activate

readUserInfoAndFill();
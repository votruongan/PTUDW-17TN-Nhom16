var temp = document.getElementsByTagName("INPUT");
var temp1 = document.getElementsByTagName("SPAN");

function BtnLogInTapped() {
    console.log("BtnDangNhap tapped!")

    var check = 1;
    for (var i = 1; i < temp.length; i++) {
        if (temp[i].value === "") {
            temp[i].style.border = "1px solid red"
            temp1[i].style.display = "block";
            check = 0;
        } else {
            temp[i].style.border = "1px solid #ced4da"
            if (temp1[i]) {
                temp1[i].style.display = "none";
            }
        }
    }
    if (check == 1) {
        //Tiến hành truy vấn đăng nhap
        login();
    }
}

function signUpTapped() {
    window.location.href = "signup";
}

async function login() {
    console.log("LogIn()");

    let email = InputEmail.value;
    let password = InputPassword.value;

    let user = {
        "email"     : email,
        "password"  : password
    };

    const url = "/log_in/"

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    let r = await response.json();
    console.log(r);

    // Success
    if (r.status == 0) {
        swal({
            title: "Thành công",
            text: "Đăng nhập thành công!",
            icon: "success",
        })
        .then(confirm => {
            if (confirm) {
                console.log("Token = ", r.token);

                localStorage.setItem("tudo_email", user.email);
                localStorage.setItem("tudo_token", r.token);

                // Navigate to home page
                window.location.href = location.host;
            }
        })

    } else {
        swal("Thất bại", "Email hoặc mật khẩu không chính xác!", "error");
    }
}

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
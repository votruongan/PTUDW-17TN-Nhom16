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
            temp1[i].style.display = "none";
        }
    }
    if (check == 1) {
        //Tiến hành truy vấn đăng nhap
        login();
    }
}

function login() {
    console.log("LogIn()");

    let email = InputEmail.value;
    let password = InputPassword.value;

    let user = {
        "email"     : email,
        "password"  : password
    };

    const url = "http://localhost:3000" + "/log_in/"

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
    if (r) {
        swal({
            title: "Thành công",
            text: "Đăng nhập thành công!",
            icon: "success",
        })
        .then(confirm => {
            if (confirm) {
                // Navigate to home page
                window.location.href = "http://localhost:3000";
            }
        })

    } else {
        swal("Thất bại", "Email hoặc mật khẩu không chính xác!", "error");
    }
}
var temp = document.getElementsByClassName("form-controlInput");
var temp1 = document.getElementsByClassName("icon-error");
var temp2 = document.getElementsByClassName("time")

function btnTiepTucdangky() {
    var check = 1;
    for (var i = 0; i < temp.length; i++) {
        if (temp[i].value === "") {
            temp[i].style.border = "1px solid red"
            temp1[i].style.display = "block";
            check = 0;
        } else {
            temp[i].style.border = "1px solid #ced4da"
            temp1[i].style.display = "none";
        }
    }
    if (temp2.length == 0) {
        temp1[4].style.display = "block";
        $(".containerUpfile").css("border", "1px solid red")
    } else {
        temp1[i].style.display = "none";
        $(".containerUpfile").css("border", "1px solid black")
    }
    if (check == 1) {
        signUpButtonTapped();

        $(".panel1").css("display", "none")
        $(".panel2").css("display", "block")
        window.scrollTo(0, 0);
    }
}

function btnquaylai() {
    $(".panel1").css("display", "block")
    $(".panel2").css("display", "none")
    window.scrollTo(0, 0);
}
$("#InputPassword1").keyup(function() {
    console.log("Loi 1")

    var pas1 = $("#InputPassword").val()
    var pas2 = $(this).val()
    if (pas1 == pas2 && pas1 != "" && pas2 != "") {
        $(".icon-correct").css("display", "block")
    } else {
        temp1[2].style.display = "block";
        $(".icon-correct").css("display", "none")

    }
})
$("#InputPassword").keyup(function() {
    console.log("Loi 2")

    var pas1 = $("#InputPassword1").val()
    var pas2 = $(this).val()
    if (pas1 == pas2 && pas1 != "" && pas2 != "") {
        $(".icon-correct").css("display", "block")
    } else {
        temp1[2].style.display = "block";
        $(".icon-correct").css("display", "none")

    }
})

//UPLOAD FILE

$(".hinh").click(function() {
    console.log("Loi 4")
    $("input[id='files']").click();
});

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    console.log("Loi 5")

    for (var i = 0, f; f = files[i]; i++) {
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader(); //biến hiện images ra   
        // Closure to capture the file information.
        reader.onload = (function(theFile) {
                return function(e) {
                    // render thumbnail.
                    var span = document.createElement('span');
                    span.classList.add('csshinhanh')
                    span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/>', '<i class="fa fa-times time " ></i>'].join('');
                    document.getElementById('previewImg').insertBefore(span, null); //chèn images vào span dựng sẵn có ID previewImg

                };
            })
            (f);
        // Read in the image file as a data URL.     
        reader.readAsDataURL(f);
    }
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);

//hàm xóa
$(document).on('click', ".time", function() {
    if (confirm("Bạn Có Muốn Xóa ?")) {
        $(this).closest("span").fadeOut();
        $("#files").val(null); //xóa tên của file trong input
    } else
        return false;
});


// SIGN UP

async function signUpButtonTapped() {
    let email = InputEmail.value;
    let password = InputPassword.value;
    let repassword = InputPassword1.value;
    let phone = Inputsdt.value;
    let name = "aaaa"
    let address = "bbb"

    if (password != repassword) {
        // Bao loi
        alert("Nhập lại mật khẩu không chính xác. Vui lòng kiểm tra và thử lại!")
        return;
    }

    let user = {
        "email"     : email,
        "password"  : password,
        "phone"     : phone,
        "name"      : name,
        "address"   : address
    }

    const url = "http://localhost:3000" + "/sign_up/"

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    let r = await response.json();
    console.log(r);
}

async function verifyButtonTapped() {
    console.log("Verify button tapped");

    let accepted = defaultCheck1.checked;
    let email = InputEmail.value;
    let user = {
        "email" : email
    }

    console.log("Accepted = ", accepted);

    if (!accepted) {
        alert("Bạn vui lòng đồng ý Điều khoản của chúng tôi trước!");
        return;
    }

    const url = "http://localhost:3000" + "/verify_account";

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
        alert("Xác thực tài khoản thành công!");
        // Navigate to home page
        window.location.href = "http://localhost:3000";
    } else {
        alert("Xác thực tài khoản thất bại");
    }
}
var temp = document.getElementsByClassName("form-controlInput");
var temp1 = document.getElementsByClassName("icon-error");

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
    if (check == 1) {
        //Tiến hành truy vấn đăng ký
    }
}
$("#InputPassword1").keyup(function() {
    var pas1 = $("#InputPassword").val()
    var pas2 = $(this).val()
    if (pas1 == pas2 && pas1 != "" && pas2 != "") {
        $(".icon-correct").css("display", "block")
    } else {
        temp1[3].style.display = "block";
        $(".icon-correct").css("display", "none")

    }
})
$("#InputPassword").keyup(function() {
    var pas1 = $("#InputPassword1").val()
    var pas2 = $(this).val()
    if (pas1 == pas2 && pas1 != "" && pas2 != "") {
        $(".icon-correct").css("display", "block")
    } else {
        temp1[3].style.display = "block";
        $(".icon-correct").css("display", "none")

    }
})

//UPLOAD FILE
function uploadFile(files, index) {
    var length = files.length
    if (index == length) {
        return;
    }
    var file = files[index];
    var fileReader = new FileReader();
    fileReader.onload = function() {
        var str = '<div class="col-4 float-left" style="width:100px; margin:2px; padding:0px;">' +
            '<img class="img-thumbnail js-file-image" style="width: 100px;"' +
            '</div>';
        $('.js-file-list').append(str);

        var imageSrc = event.target.result;
        $('.js-file-image').last().attr('src', imageSrc);
        uploadFile(files, index + 1)
    };
    fileReader.readAsDataURL(file);
}
$('#fileInput').on('change', function() {
    var files = $(this)[0].files;
    uploadFile(files, 0)
});
var temp = document.getElementsByTagName("INPUT");
var temp1 = document.getElementsByTagName("SPAN");

function btndangnhap() {
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
    }
}
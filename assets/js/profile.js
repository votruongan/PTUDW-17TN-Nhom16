// TUDO
// Group 16

async function initViewForUserData() {
    let email = localStorage.getItem("tudo_email");
    if (email == "") {
        return;
    }

    let user = await getUserInfo(email);

    console.log("User: ", user);

    if (user[0]) {
        avatarImg.src = "http://localhost:3000/" + user[0].avatar;
        profileName.innerText = user[0].name;
        profileEmail.innerText = user[0].email;
        profilePhonenumber.innerText = user[0].phone;
        profileCMND.innerText = user[0].id_number;       
        profileAddress.innerText = user[0].address;
    } else {
        window.location.href = "http://localhost:3000/?loginState=0"
    }
}

// Activate

initViewForUserData();

// Actions

function updateProfileTapped() {
    window.location.href = "http://localhost:3000/edit-profile";
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
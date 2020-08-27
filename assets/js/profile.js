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
        profileName.innerText = user[0].name;
        profileEmail.innerText = user[0].email;
        profilePhonenumber.innerText = user[0].phone;
        profileCMND.innerText = user[0].id_number;       
    }
}

// Activate

initViewForUserData();
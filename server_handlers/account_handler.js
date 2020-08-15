const dbHelper = require("./database_helper");
const util = require('util');

const promiseFind = util.promisify(dbHelper.findDocument);

const userCollection = "Users";

async function isValidUsername(username) {
	let res = await promiseFind("Users", {username}).catch((e)=>console.log(e));

	console.log("res = ", res);

	if (res) {
		return false;
	}
	return true;
}

async function isValidPhoneNumber(phonenumber) {
	let res = await promiseFind("Users", phonenumber).catch((err) => {
		console.log("Err: ", err);
	});

	if (res) {
		return false;
	}
	return true;
}

function createUser(user) {
	dbHelper.insertDocument(userCollection, user);
}

async function signUpRequest(username, password, name, phonenumber, address) {
	let user = {
		"username" 	: username,
		"password"	: password,
		"name"		: name,
		"phone" 	: phonenumber,
		"address"	: address
	};

	// 1. Check username is valid
	let validUsername = await isValidUsername(username);

	console.log("Valid Username: ", validUsername);

	// 2. Check phonenumber is valid
	let validPhonenumbeer= await isValidPhoneNumber(phonenumber);

	console.log("Valid phonenumber: ", validPhonenumbeer);

	// 3. If valid, create user
	if (validUsername && validPhonenumbeer) {
		createUser(user);
	} else {
		console.log("TH: Create user failed");
	}
}

signUpRequest("tonhieu", "123", "Hieu", "123", "123");
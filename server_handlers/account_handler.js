const dbHelper = require("./database_helper");
const e = require("express");

const userCollection = "Users";
const sessionCollection = "Sessions";

function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

async function isValid(user) {
	let res = await dbHelper.findDocument("Users", user).catch((e)=> {
		console.log(e);
	});
	console.log("res = ", res);

	if (res && res.length > 0) {
		return false;
	}
	return true;
}

async function createUser(user) {
	let res = await dbHelper.insertDocument(userCollection, user).catch((err) => {
		console.log("Err: ", err);
	})

	if (res) {
		return true;
	}
	return false;
}

async function verify(user) {
	let res = await dbHelper.updateDocument(userCollection, user).catch((err) => {
		console.log("Err: ", err);
	});

	if (res) {
		return true;
	}
	return false;
}

async function logIn(user) {
	let res = await dbHelper.findDocument(userCollection, user).catch((err) => {
		console.log("Err", err);
	});

	if (res) {
		let token =	makeid(12);
		let sessionRes = await setSesstion(user.email, token);
		if (sessionRes) {
			return true;
		}
		return false;
	}
	return false;
}

async function setSesstion(email, token) {
	let date = new Date();
	let session = {
		"email"	: email,
		"token"	: token,
		"ts"	: date.getTime()
	}

	if (UserHandler.isValidToken(email, token)) {
		let res = dbHelper.updateDocument(sessionCollection, session).catch((err) => {
			console.log("Update session err = ", err);
		});

		if (res) {
			return true;
		}
		return false;

	} else {
		let res = dbHelper.insertDocument(sessionCollection, session).catch((err) => {
			console.log("Insert session err = ", err);
		});

		if (res) {
			return true;
		}
		return false;
	}
}

// Module class for export
class UserHandler {
	
	static signUpRequest = async function(email, password, name, phonenumber, address) {
		let user = {
			"email"		: email,
			"password"	: password,
			"name"		: name,
			"phone" 	: phonenumber,
			"address"	: address
		};
	
		// 1. Check email is valid
		let validEmail = await isValid({email});
		console.log("Valid email: ", validEmail)
	
		// 2. Check phonenumber is valid
		let validPhonenumber= await isValid({"phone": phonenumber});
		console.log("Valid phonenumber: ", validPhonenumber);

		// 3. Check and return
		if (!validEmail) {
			return 1;
		}
		if (!validPhonenumber) {
			return 2;
		}

		// 4. If valid, create user
		let created = await createUser(user)
		console.log("Created = ", created)

		if (created) {
			return 0; // Success
		} else {
			return 3; // Failed
		}
	}

	static logInRequest = async function(email, password) {
		let user = {
			"email"		: email,
			"password" 	: password
		}

		let logInResult = await logIn(user);
		console.log("LogInRes = ", logInResult);

		if (logInResult) {
			return true;
		}
		return false;
	}

	static verifyAccountRequest = async function(email) {
		let user = {
			"email" : email,
			"verify": true
		};

		let verifyResult = await verify(user);
		console.log("Verify res = ", verifyResult);

		if (verifyResult) {
			return true;
		}
		return false;
	}

	static isValidToken = async function(email, token) {
		let date = new Date();
		let session = {
			"email"	: email,
			"token"	: token
		}

		let res = dbHelper.findDocument(sessionCollection, session).catch((err) => {
			console.log(err);
		});

		// If this session is found
		if (res) {
			let lastLogInTime = res.ts;

			// Check if session is out of date: 3 days
			if (date.getTime() - lastLogInTime >= 3*24*3600*1000) {
				// Remove this session in db and return false
				dbHelper.deleteDocument(sessionCollection, session);
				return false;

			} else {
				return true;
			}

		} else {
			return false;
		}
	}
	
	static updateSession = async function(email, token) {
		let res = await setSesstion(email, token);
		return res;
	}
}

module.exports = UserHandler;
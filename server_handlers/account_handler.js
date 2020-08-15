const dbHelper = require("./database_helper");

const userCollection = "Users";

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

async function logIn(user) {
	let res = await dbHelper.findDocument(userCollection, user).catch((err) => {
		console.log("Err", err);
	});

	if (res) {
		return true;
	}
	return false;
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
}

module.exports = UserHandler;

UserHandler.signUpRequest("TONHIEU", "123",  "Hieu", "1234", "123")
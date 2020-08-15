const dbHelper = require("./database_helper");

const userCollection = "Users";

class UserHandler {
	static isValidUsername = async function(username) {
		let res = await dbHelper.findDocument("Users", {username}).catch((e)=> {
			console.log(e);
		});
		console.log("res = ", res);
	
		if (res && res.length > 0) {
			return false;
		}
		return true;
	}
	
	static isValidPhonenumber = async function(phonenumber) {
		let res = await dbHelper.findDocument("Users", {"phone" : phonenumber}).catch((err) => {
			console.log("Err: ", err);
		});
	
		if (res && res.length > 0) {
			return false;
		}
		return true;
	}
	
	static createUser = async function(user) {
		let res = await dbHelper.insertDocument(userCollection, user);

		console.log("insert res = ")
		if (res) {
			return true;
		}
		return false;
	}
	
	static signUpRequest = async function(username, password, name, phonenumber, address) {
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
		let validPhonenumber= await isValidPhoneNumber(phonenumber);
	
		console.log("Valid phonenumber: ", validPhonenumber);

		if (!validUsername) {
			return 1;
		}
		if (!validPhonenumber) {
			return 2;
		}

		// 3. If valid, create user
		

		let created = await createUser(user)
		if (created) {
			return 0; // Success
		} else {
			return 3; // Failed
		}
	}
}

module.exports = UserHandler;
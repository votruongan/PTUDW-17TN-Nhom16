const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'tudo_account_db';

// Modules functions ////////////////////////////////////////////

function createAccount(username, password, callback) {
	// Create a new MongoClient
	const client = new MongoClient(url);

	client.connect(function (err) {
		const db = client.db(dbName);
		const collection = db.collection('user');

		collection.insertMany([
			{
				"username": username,
				"password": password,
				"name": "",
				"birth": "1/1/1990"
			}
		], function (err, result) {
			assert.equal(err, null);
			console.log("Insert account succeeded!");

			if (callback) {
				callback(result);
			}
		});

		client.close();
	});
}

function createAccountByUserInfo(user, callback) {
	
}

// Export modules /////////////////////////////////////////////

exports.mongodbConnect = function () {
	// connectToMongodb();
};

exports.createAccount = function (username, password, callback) {
	createAccount(username, password, callback);
};
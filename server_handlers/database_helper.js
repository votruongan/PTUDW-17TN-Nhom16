const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";

function createCollection(collectionName){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tudo");
    dbo.createCollection(collectionName, function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}

function insertDocument(collection,doc){
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("tudo");
      dbo.collection(collection).insertOne(doc, function(err, res) {
          if (err) throw err;
          db.close();
      });
  });
}

function findDocument(collection,queryObject,successCallback){
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("tudo");
      dbo.collection(collection).find(queryObject).toArray(function(err, result) {
        if (err) throw err;
        successCallback(result);
        db.close();
      });
  });      
}

function deleteDocument(collection,queryObject){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tudo");
    dbo.collection(collection).deleteOne(queryObject, function(err, obj) {
      if (err) throw err;
      db.close();
    });
  });  
}

module.exports = {
  createCollection,
  insertDocument,
  findDocument,
  deleteDocument,
};
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "tudo";

function initDatabase(){
  MongoClient.connect(url+"/" + dbName,(err,db)=>{
    if (err) throw err;
    console.log("Database",dbName,"created!");
    db.close();
  })
}

function createCollection(collectionName){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tudo");
    dbo.createCollection(collectionName, function(err, res) {
      if (err) throw err;
      console.log("Collection",collectionName,"created in db",dbName);
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
          console.log(doc," inserted to collection",collection,"db",dbName);
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
        return result;
      });
  });      
}

function deleteDocument(collection,queryObject){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tudo");
    dbo.collection(collection).deleteOne(queryObject, function(err, obj) {
      if (err) throw err;
      console.log(obj," removed from collection",collection,"db",dbName);
      db.close();
    });
  });  
}

module.exports = {
  initDatabase,
  createCollection,
  insertDocument,
  findDocument,
  deleteDocument,
};
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "tudo";

function initDatabase(){
  MongoClient.connect(url+"/" + dbName,(e,db)=>{
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
  return new Promise((resolve,reject)=>{
    MongoClient.connect(url, function(err, db) {
        if (err) resolve(false);
        var dbo = db.db("tudo");
        dbo.collection(collection).insertOne(doc, function(err, res) {
            if (err) resolve(false);
            console.log(doc," inserted to collection",collection,"db",dbName);
            resolve(true);
            db.close();
        });
    });
  }
}

function findDocument(collection,queryObject){
  return new Promise((resolve,reject)=>{
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tudo");
        dbo.collection(collection).find(queryObject).toArray(function(err, result) {
          if (err) reject(err);
          resolve(result);
          db.close();
        });
    });
  })     
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

async function main(){
  let res = await findDocument("booking-1",{userId:'123'});
  console.log(res);
}
main()

module.exports = {
  initDatabase,
  createCollection,
  insertDocument,
  findDocument,
  deleteDocument,
};
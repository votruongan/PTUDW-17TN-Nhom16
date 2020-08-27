const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://localhost:27017";
const dbName = "tudo";

async function sleep(ms){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>resolve(true),ms);
  })
}

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
  return new Promise((resolve,reject)=>{
    MongoClient.connect(url, function(err, db) {
        if (err) resolve(false);
        var dbo = db.db("tudo");
        doc.timeStamp = Date.now();
        dbo.collection(collection).insertOne(doc, function(err, res) {
            if (err) resolve(false);
            console.log(res.ops[0]," inserted to collection",collection,"db",dbName);
            resolve(res.ops[0]);
            db.close();
        });
    });
  });
}

function findDocument(collection,queryObject){
  return new Promise((resolve,reject)=>{
    MongoClient.connect(url, function(err, db) {
        if (err) resolve(false);
        var dbo = db.db("tudo");
        dbo.collection(collection).find(queryObject).toArray(function(err, result) {
          if (err) resolve(false);
          resolve(result);
          db.close();
        });
    });
  })
}

function updateDocument(collection,queryObject,dataObject) {
  return new Promise((resolve,reject)=>{
    MongoClient.connect(url,async function(err, db) {
        if (err) resolve(false);
        var dbo = db.db("tudo");
        dbo.collection(collection).findOneAndUpdate(
          queryObject, // query
          {$set: dataObject}, // replacement 
        );
        await sleep(100)
        resolve(true)
    });
  })
}

function deleteDocument(collection,queryObject){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tudo");
    dbo.collection(collection).deleteOne(queryObject, function(err, obj) {
      if (err) throw err;
      console.log(obj.deletedCount," document removed from collection",collection,"db",dbName);
      db.close();
    });
  });  
}

function deleteManyDocument(collection,queryObject){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tudo");
    dbo.collection(collection).deleteMany(queryObject, function(err, obj) {
      if (err) throw err;
      console.log(obj.deletedCount," document removed from collection",collection,"db",dbName);
      db.close();
    });
  });
}

//CREATE for RENT-LEASE
// createCollection("rent");
// createCollection("payment");
// createCollection("image-log");

// createCollection("Users");
// createCollection("Sessions");

async function start(){
  // console.log(await findDocument("payment",{}));
}
start()
module.exports = {
  initDatabase,
  createCollection,
  insertDocument,
  findDocument,
  deleteDocument,
  updateDocument,
  deleteManyDocument
};

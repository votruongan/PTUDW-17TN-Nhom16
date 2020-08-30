const dbHelper = require("./database_helper");

const stuffCollection = "Stuff";
const sessionCollection = "Sessions";
const userCollection = "Users";

function makeid(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	   result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
 }

async function createStuff(stuff) {
	let res = await dbHelper.insertDocument(stuffCollection, stuff).catch((err) => {
		console.log("Err: ", err);
	})

	if (res) {
		return true;
	}
	return false;
}
class StuffHandler{
    static getRenterInfo = async function (email) {
        let res = await dbHelper.findDocument(userCollection,{"email":email}).catch((err)=>{
            console.log(err);
        });
        if (res[0]){
            let res1={
                "name": res[0]["name"],
                "create_date": res[0]["create_date"],
                "avatar": res[0]["avatar"]
            }
            return res1;
        }
    }
    static getUserItem = async function (token,email) {
        let token1={
            "email":email,
            "token":token
        }
        let res = await dbHelper.findDocument(sessionCollection, token1).catch((err) => {
			console.log(err);
        });
        if (res) {
            let res1 = await dbHelper.findDocument(stuffCollection,{"email": email}).catch((err)=>{
                console.log(err);
            })
            return res1;
        }
    }
    static search = async function (name) {
        let res = await dbHelper.searchDocument(stuffCollection,name).catch((err)=>{
            console.log(err);
        })
        console.log(res)
        return res;
    }
    static getItem = async function(itemId){
        let res = await dbHelper.findDocument(stuffCollection,{"id":itemId}).catch((err)=>{
            console.log(err);
        })
        if (res[0]) {
            let res1 = await dbHelper.findDocument(userCollection,{"email": res[0]["email"]}).catch((err)=>{
                console.log(err);
            })
            var res2 ={
                "id": res[0]["id"],
                "name": res[0]["name"],
                "category": res[0]["category"],
                "cost": res[0]["cost"],
                "path": res[0]["path"],
                "services":res[0]["services"],
                "describe": res[0]["describe"],
                "userName": res1[0]["name"],
                "create_date": res1[0]["create_date"],
                "rating" : res1[0]["rating"],
                "avatar" : res1[0]["avatar"],
                "star": res[0]["star"],
                "nuRentTimes":res[0]["nuRentTimes"],
                "address": res[0]["address"],
                "email": res[0]["email"],
            }
            return res2;
        }
        return false;
    }
    static postItem = async function (token,email, body) {
        let token1={
            "email":email,
            "token":token
        }
        let res = await dbHelper.findDocument(sessionCollection, token1).catch((err) => {
			console.log(err);
        });
        if (res) {
            let stuff = {
                "id": makeid(7),
                "email": res[0]["email"],
                "name": body["name"],
                "category": body["category"],
                "cost": body["money"],
                "phone":body["phone"],
                "address": body["address"],
                "path": body["path"],
                "services":body["services"],
                "describe": body["describe"],
                "star": 0,
                "nuRentTimes":0,
                "renter": "",
                "status": 0,
                "rentDateFrom":0,
                "rentDateTo":0
            }

            let created = await createStuff(stuff);

            if (created) return stuff["id"];
            else return 0;
        }
        
    }
}

module.exports = StuffHandler;
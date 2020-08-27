const dbHelper = require("./database_helper");

const stuffCollection = "Stuff";
const sessionCollection = "Sessions";
const userCollection = "Users";
//dbHelper.createCollection(stuffCollection);
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
                // "services":services,
                "describe": res[0]["describe"],
                "userName": res1[0]["name"]
            }
            return res2;
        }
        return false;
    }
    static postItem = async function (token, body) {
        let token1={
            "token":token,
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
                // "services":services,
                "describe": body["describe"]
            }    

            let created = await createStuff(stuff);

            if (created) return stuff["id"];
            else return 0;
        }
        
    }
}

module.exports = StuffHandler;
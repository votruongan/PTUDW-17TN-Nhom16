const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const rentingHandler = require('./server_handlers/renting_handler');
const leasingHandler = require('./server_handlers/leasing_handler');
const userHandler = require('./server_handlers/account_handler');
const stuffHandler = require('./server_handlers/stuff_handler');
const path = require('path');
const multer = require('multer'); //cài đặt  dependencie
const fs = require('fs');

const dbHelper = require('./server_handlers/database_helper');
const { raw, json } = require('body-parser');
const { request } = require('express');
 
const app = express();
const port = process.env.PORT || 3000;

app.use(favicon("assets/img/fav.png"));
app.use(express.static(__dirname + '/assets/'));
app.use(bodyParser.json({limit: '10mb'}));

// FUNCTIONS
function responseError(res){
    res.sendStatus(500)
}

//--------------- UP load anh------------
const upload = multer({
    dest:'images/',
    fileFilter: (req,file,callback)=>{
        if (/\S+\.(jpg|bmp|gif|png)/gi.test(file.originalname)){
            callback(null,true)
        }else {
            callback(Error('Invalid image file name'),false)
        }
    }
}).single('image')

app.post('/images/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if (err){
            res.status(400).json({message:err.message})
        }else {
            res.status(200).json({
                message:'Uploaded image successfully',
                image_path: path.join('images',req.file.filename)
            })
        }
    })

})

app.get('/images/:image_name',(req,res)=>{
    const imagePath = path.join(__dirname,'images',req.params.image_name)
    try {
        
        const buffer = fs.readFileSync(imagePath)
        let mime='image/jpeg';
        res.writeHead(200,{'Content-Type':mime})
        res.end(buffer,'binary')
    }
    catch(error){
        console.log(error.code)
        if(error.code === 'ENLENT'){
            res.status(404).json({message:"No such image file"})
        }else {
            res.status(500).json({message:error.message})
        }
        res.end()
    }
})

//--------------HET UPLOAD ANH----------------
app.post('/item/post', jsonParser, async (req, res) => {
    const body = req.body;
    console.log(body);
    const token = req.headers['token'];
    console.log(token);

    if (token == null || token == '') return responseError(res);
    res.send({id:await stuffHandler.postItem(token,body)});
})

app.get('/item/:itemId',async (req, res) => {
    const itemId = req.params.itemId;
    res.sendFile(__dirname + '/html/item-info-page.html');

    //res.send(stuff[0])
})

app.get('/item/id/:itemId',async (req, res) => {
    const itemId = req.params.itemId;
    const stuff = await stuffHandler.getItem(itemId);
    console.log(stuff)
    res.send(stuff);

})

app.post('/rent-date-time/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const itemId = req.params.itemId;
    const clientId = body.userId;
    if (!clientId || ! itemId) return responseError(res);
    res.send(await rentingHandler.fetchRentDateTime({itemId,clientId}));
})

const rentHandleArray = ['handleRentRequest','handleDeposit','handleReceieve','handleChangeRequest','handleReturn','handleFinish']
app.post('/rent-item/:stageId/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const clientId = body.userId;
    if (!clientId || ! itemId || !stage) return responseError(res);
    let handlerStr = null;
    try{
        handlerStr = rentHandleArray[parseInt(stage)-1];
        if (handlerStr == null) throw null;
    }
    catch {
        return responseError(res)
    }
    console.log(handlerStr, rentingHandler[handlerStr])
    if (handlerStr){
        const result = await rentingHandler[handlerStr](itemId,clientId,body);
        res.send(result);
    } else
    responseError(res)
})

app.post('/result-rent-item/:stageId/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const uId = body.userId;
    if (!uId || !itemId || !stage) return responseError(res);
    const allInfo = {stage, itemId, clientId:uId}
    res.send({status:await rentingHandler.fetchRentStatus(allInfo)});
})

const leaseHandleArray = ['handleRentRequest','handleSendItem','handleChangeRequest','handleReceieve','handleFinish']
app.post('/lease-item/:stageId/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const clientId = body.userId;
    const timeStamp = Date.now();
    if (!clientId || ! itemId || !stage) return responseError(res);
    let handlerStr = null;
    try{
        handlerStr = leaseHandleArray[parseInt(stage)-1];
        if (handlerStr == null) throw null;
    }
    catch {
        return responseError(res)
    }
    console.log(handlerStr, leasingHandler[handlerStr])
    if (handlerStr){
        const result = await leasingHandler[handlerStr](itemId,clientId,body);
        res.send(result);
    } else
    responseError(res)
})

// app.post('/result-lease-item/:stageId/:itemId', jsonParser, async (req, res) => {
//     const body = req.body;
//     const stage = req.params.stageId;
//     const itemId = req.params.itemId;
//     const uId = body.userId;
//     if (!uId || !itemId || !stage) return responseError(res);
//     const allInfo = {stage, itemId, clientId:uId}
//     res.send(await rentingHandler.fetchRentStatus(allInfo));
// })

// ACCOUNT HANDLER MODULES

app.post('/sign_up', jsonParser, async (req, res) => {
    const body = req.body;

    let result = await userHandler.signUpRequest(body.email, body.password, body.name, body.phone, body.address, body.personalID);

    res.send({result});
})

app.post('/verify_account', jsonParser, async (req, res) => {
    const body = req.body;

    let result = await userHandler.verifyAccountRequest(body.email)

    res.send(result);
})

app.post('/log_in', jsonParser, async (req, res) => {
    const body = req.body;

    let result = await userHandler.logInRequest(body.email, body.password);

    res.send(result);
})

app.post('/log_out', jsonParser, async (req, res) => {

    const body = req.body;

    let result = await userHandler.logOut(body.email);

    res.send(result);
})

app.post('/auth_by_token', jsonParser, async (req, res) => {
    console.log("Auth by token");

    const body = req.body;

    let result = await userHandler.isValidToken(body.email, body.token);

    res.send(result);
});

app.post('/get_user_info', jsonParser, async (req, res) => { 
    const body = req.body;

    console.log(body);

    let result = await userHandler.getUserInfo(body.email);

    res.send(result);
});

app.post('/update_info', jsonParser, async (req, res) => {
    const body = req.body;

    console.log(body);

    let authRes = await userHandler.isValidToken(body.email, body.token);

    if (authRes) {
        let updateRes = await userHandler.updateUserInfo(body.email, body.name, body.address, body.phone);
        if (updateRes) {
            res.send({
                "state" : true,
                "mess" : "Cập nhật thông tin thành công!"
            });
        } else {
            res.send({
                "state" : false,
                "mess" : "Cập nhật thông tin thất bại!"
            });
        }

    } else {
        res.send({
            "state" : false,
            "mess" : "Phiên của bạn đã hết. Vui lòng đăng nhập và thử lại!"
        });
    }
})

// STATIC FILE SERVING

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/html/index.html');
})

app.get('/info', (req, res) => {
    res.sendFile(__dirname + '/html/item-info-page.html');
})

app.get('/item', (req, res) => {
    res.sendFile(__dirname + '/html/item-info-page.html');
})

app.get('/post-item', (req, res) => {
    res.sendFile(__dirname + '/html/post-item.html');
})


app.get('/rent', (req, res) => {
    res.sendFile(__dirname + '/html/rent.html');
})

app.get('/lease', (req, res) => {
    res.sendFile(__dirname + '/html/lease.html');
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/html/signup.html');
})

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/html/profile.html')
})

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/html/about.html');
})

app.get('/forgot-password', (req, res) => {
    res.sendFile(__dirname + '/html/forgot-password.html');
})

app.get('/search', (req, res) => {
    res.sendFile(__dirname + '/html/search.html');
})

app.get('/login', (req, res) => {
    console.log("TONHIEU: send login file")
    res.sendFile(__dirname + '/html/login.html');
})

app.get('/manage', (req, res) => {
    res.sendFile(__dirname + '/html/manage.html');
})

app.get('/edit-profile', (req, res) => {
    res.sendFile(__dirname + '/html/edit-profile.html')
})

app.listen(port, () => console.log(`TUDO app is listening at http://localhost:${port}`))
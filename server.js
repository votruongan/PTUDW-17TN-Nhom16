const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const rentingHandler = require('./server_handlers/renting_handler');
const userHandler = require('./server_handlers/account_handler');

const dbHelper = require('./server_handlers/database_helper');
const { raw } = require('body-parser');
const { request } = require('express');
 
const app = express();
const port = process.env.PORT || 3000;

app.use(favicon("assets/img/fav.png"));
app.use(express.static(__dirname + '/assets/'));

// FUNCTIONS
function responseError(res){
    res.sendStatus(500)
}

app.post('/rent-item/:stageId/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const clientId = body.userId;
    const timeStamp = Date.now();
    if (!clientId || ! itemId || !stage) return responseError(res);
    let result = null;
    switch (stage) {
        case "1":
            result = await rentingHandler.writeBookingRequest(itemId,clientId,body.message);
            break;
        case "2":
            result = await rentingHandler.writeToRenting(2,{itemId,clientId,timeStamp});
            break;
        case "3":
            result = await rentingHandler.writeToRenting(3,{itemId,clientId,timeStamp});
            break;
        case "4":
            result = await rentingHandler.writeToRenting(4,{itemId,clientId,timeStamp});
            break;
        default:
            return responseError(res)
            break;
    }
    res.send(result);
})

app.post('/manage-renting-item/:stageId/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const uId = body.userId;
    if (!uId || !itemId || !stage) return responseError(res);
    const allInfo = {stage, itemId, clientId:uId}
    res.send(await rentingHandler.fetchRentStatus(allInfo));
})

// ACCOUNT HANDLER MODULES

app.post('/sign_up', jsonParser, async (req, res) => {
    const body = req.body;

    let result = await userHandler.signUpRequest(body.email, body.password, body.name, body.phone, body.address);

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
    res.sendFile(__dirname + '/html/login.html');
})

app.get('/manage', (req, res) => {
    res.sendFile(__dirname + '/html/manage.html');
})

app.listen(port, () => console.log(`TUDO app is listening at http://localhost:${port}`))
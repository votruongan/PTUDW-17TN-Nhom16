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
app.post('/rent-date-time/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const itemId = req.params.itemId;
    const clientId = body.userId;
    if (!clientId || ! itemId) return responseError(res);
    res.send(await rentingHandler.fetchRentDateTime({itemId,clientId}));
})

app.post('/rent-item/:stageId/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const clientId = body.userId;
    if (!clientId || ! itemId || !stage) return responseError(res);
    let handlerStr = null;
    switch (stage) {
        case "1":
            handlerStr =  'handleRentRequest';            break;
        case "2":
            handlerStr = 'handleDeposit';            break;
        case "3":
            handlerStr = 'handleReceieve';            break;
        case "4":
            handlerStr = 'handleReturn';            break;
        default:
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

app.post('/lease-item/:stageId/:itemId', jsonParser, async (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const clientId = body.userId;
    const timeStamp = Date.now();
    if (!clientId || ! itemId || !stage) return responseError(res);
    let handlerStr = null;
    switch (stage) {
        case "1":
            break;
        case "2":
            break;
        case "3":
            break;
        case "4":
            break;
        default:
            return responseError(res)
    }
    res.send(result);
})

app.post('/result-lease-item/:stageId/:itemId', jsonParser, async (req, res) => {
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
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const bookingHandler = require('./server_handlers/booking_handler');
const userHandler = require('./server_handlers/account_handler');

const dbHelper = require('./server_handlers/database_helper');
 
const app = express();
const port = process.env.PORT || 3000;

app.use(favicon("assets/img/fav.png"));
app.use(express.static(__dirname + '/assets/'));

// FUNCTIONS
function responseError(res){
    res.sendStatus(404)
}

app.post('/rent-item/:stageId/:itemId', urlencodedParser, (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const uId = body.userId
    if (!uId || ! itemId || !stage) return responseError(res);
    switch (stage) {
        case "1":
            bookingHandler.writeBookingRequest(itemId,uId,body.message); 
            break;
        default:
            return responseError(res)
            break;
    }
})

app.post('/manage-renting-item/:stageId/:itemId', urlencodedParser, (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;
    const uId = body.userId;
    if (!uId || !itemId || !stage) return responseError(res);
    const successResponse = function (obj){
        res.send(obj);
    }
    console.log(successResponse);
    switch (stage) {
        case "1":
            bookingHandler.fetchBookingRequest(itemId,successResponse); 
            break;
        default:
            responseError(res)
            break;
    }
})

app.post('/sign_up', jsonParser, (req, res) => {
    const body = req.body;
    console.log(body);

    userHandler.signUpRequest(body.username, body.password, body.name, body.phone, body.email, body.address);
})

// ACCOUNT HANDLER MODULES


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
const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const bookingHandler = require('./server_handlers/booking_handler');

const dbHelper = require('./server_handlers/database_helper');
 
const app = express();
const port = process.env.PORT || 3000;

app.use(favicon("assets/img/fav.png"));
app.use(express.static(__dirname + '/assets/'));

// FUNCTIONS

app.post('/book-item/:stageId/:itemId', urlencodedParser, (req, res) => {
    const body = req.body;
    const stage = req.params.stageId;
    const itemId = req.params.itemId;    
    bookingHandler.sendBookingRequest(itemId,body.userId,body.message);
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


app.get('/booking', (req, res) => {
    res.sendFile(__dirname + '/html/booking.html');
})

app.get('/leasing', (req, res) => {
    res.sendFile(__dirname + '/html/leasing.html');
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
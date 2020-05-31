const express = require('express');
var favicon = require('serve-favicon');
const app = express();
const port = 3000;


app.use(favicon("assets/img/fav.png")); 
app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res) =>{
	res.sendFile(__dirname + '/html/index.html');
})

app.get('/info', (req, res) => {
	res.sendFile(__dirname + '/html/item-info-page.html');
})

app.get('/post-item', (req, res) =>{
	res.sendFile(__dirname + '/html/post-item.html');
})


app.get('/booking', (req, res) =>{
	res.sendFile(__dirname + '/html/booking.html');
})

app.get('/leasing', (req, res) =>{
	res.sendFile(__dirname + '/html/leasing.html');
})

app.get('/signup', (req, res) =>{
	res.sendFile(__dirname + '/html/signup.html');
})

app.get('/profile', (req, res) => {
	res.sendFile(__dirname + '/html/profile.html')
})

app.get('/about', (req, res) => {
	res.sendFile(__dirname + '/html/about.html');
})


app.listen(port, () => console.log(`TUDO app is listening at http://localhost:${port}`))
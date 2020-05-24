const express = require('express')
const app = express()
const port = 3000

app.use(express.static(__dirname + '/assets/'));

app.get('/', (req, res) =>{
	res.sendFile(__dirname + '/html/index.html');
})

app.get('/post-stuff', (req, res) =>{
	res.sendFile(__dirname + '/html/post-stuff.html');
})

app.listen(port, () => console.log(`TUDO app is listening at http://localhost:${port}`))
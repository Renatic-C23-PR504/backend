require('dotenv').config();
const express = require('express');
const router = require('./routes/router');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
   res.send('hi klean smua');
});

app.use('/', router);

app.listen(port, () => {
   console.log(`http://localhost:${port}/`);
});

// const fs = require('fs');

// const imageFilePath = 'a.png';
// const imageData = fs.readFileSync(imageFilePath).toString('base64');

// console.log(imageData);

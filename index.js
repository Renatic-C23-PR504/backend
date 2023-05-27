const express = require('express');
const router = require('./routes/router');
const app = express();
const port = 8080;

// require('dotenv').config();

app.get('/', (req, res) => {
   res.send('hi klean smua');
});

app.use('/', router);

app.listen(port, () => {
   console.log(`http://localhost:${port}/`);
});

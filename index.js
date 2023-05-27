require('dotenv').config()
const express = require('express');
const router = require('./routes/router');
const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
   res.send('hi klean smua');
});

app.use('/', router);

app.listen(port, () => {
   console.log(`http://localhost:${port}/`);
});

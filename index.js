const express = require('express');
const paths = require('./routes/paths');
const app = express();
const port = 8080;

// const bodyParser = require('body-parser');
// nangkep form jadi json
// app.use(bodyParser.json())

app.get('/', (req, res) => {
   res.send('hi klean smua');
});

app.use(paths);

app.listen(port, () => {
   console.log(`http://localhost:${port}/`);
});

const express = require('express');
const router = require('./routes/paths');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');

const db = require('./routes/paths');

//nangkep form jadi json
app.use(bodyParser.json())

app.get('/', (req, res) => {
   res.send('Hello World!');
});

app.use(router);

app.listen(port, () => {
   console.log(`Example app listening on port ${port}`);
});

//ngambil data 
app.get('/data', (req, res) => {
   db.query("SELECT * FROM users", (error, result) => {
      //hasil mysql
      console.log(result)
      res.send(result)
   })
})
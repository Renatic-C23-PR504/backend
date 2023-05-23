const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');

const db = require('./routes/paths');

//nangkep form jadi json
app.use(bodyParser.json())

app.get('/', (req, res) => {
   res.send('Hello World!');
});

app.get('/cek', (req, res) => {
   res.send('ini cek!');
});

//ngecek request dari form
app.put('/form1', (req, res) => {
   console.log({ testRequest: req.body })
   res.send('berhasil request')
})

app.get('/form2', (req, res) => {
   console.log({ urlParam: req.query.umur })
   res.send('berhasil request umur aja')
})

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
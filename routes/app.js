const express = require('express');
const mysql = require('mysql');
const app = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

// nangkep form jadi json
app.use(bodyParser.json());
let encodeUrl = bodyParser.urlencoded({ extended: false });

//untuk ngecek" console.log(req);
app.use(
   sessions({
      secret: 'thisismysecrctekey',
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
      resave: false,
   })
);

app.use(cookieParser());

// TODO: Sesuaikan konfigurasi database
const connection = mysql.createConnection({
   host: '34.101.152.116',
   user: 'root',
   database: 'main_db',
   password: '/dR/%prDH0I5r)F>',
});

app.get('/all', (req, res) => {
   const query = `select * from users`;
   connection.query(query, (err, rows, field) => {
      if (err) {
         res.status(200).send({ message: err.sqlMessage });
      } else {
         res.json(rows);
      }
   });
});

app.post('/register', (req, res) => {
   var name = req.body.name;
   var email = req.body.email;
   var password1 = req.body.password1;
   var password2 = req.body.password2;

   const query = `INSERT INTO users(nameUser, email, password1, password2) VALUES ('${name}', '${email}', '${password1}', '${password2}' )`;
   connection.query(query, (err, result) => {
      if (err) {
         res.status(500).send({ message: err.sqlMessage });
      } else {
         res.json(result);
      }
   });
});

module.exports = app;
// router.get('/dashboard', (req, res) => {
//    const query =
//       'select (select count(*) from records where month(records.date) = month(now()) AND year(records.date) = year(now())) as month_records, (select sum(amount) from records) as total_amount;';
//    connection.query(query, (err, rows, field) => {
//       if (err) {
//          res.status(500).send({ message: err.sqlMessage });
//       } else {
//          res.json(rows);
//       }
//    });
// });

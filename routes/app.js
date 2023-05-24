const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Jumlah salt rounds yang digunakan untuk menghasilkan salt

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
   var { name, email, password1, password2 } = req.body;
   if (password1 === password2) {

      // Membuat salt untuk hashing password
      bcrypt.genSalt(saltRounds, (err, salt) => {
         if (err) {
            return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
         }

         // Meng-hash password dengan salt yang dihasilkan
         bcrypt.hash(password1, salt, (err, hash) => {
            if (err) {
               return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
            }
            const queryRegister = `INSERT INTO users(nameUser, email, password1, password2) VALUES (?,?,?,?)`;
            connection.query(queryRegister, [name, email, hash, password2], (err, result) => {
               if (err) {
                  res.status(500).send({ message: err.sqlMessage });
               } else {
                  res.json(result);
               }
            });
         });
      });
   } else {
      res.status(500).json({ message: 'Password tidak sama' });
   }
});

app.post('/login', (req, res) => {
   var { email, password } = req.body;

   const queryLogin = `SELECT * FROM users WHERE email = ?`;
   connection.query(queryLogin, [email], (err, result) => {
      if (err) {
         res.status(500).send({ message: err.sqlMessage });
      }

      if (result.length > 0) {
         const user = result[0];

         // Membandingkan password yang diinput dengan password yang tersimpan dalam database
         bcrypt.compare(password, user.password1, (err, isMatch) => {
            if (err) {
               // Mengirimkan respons jika terjadi kesalahan pada bcrypt
               return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
            }

            if (isMatch) {
               // Jika autentikasi berhasil
               res.status(200).json({ message: 'Login berhasil' });
            } else {
               // Jika autentikasi gagal
               res.status(401).json({ message: 'Password tidak cocok' });
            }
         });
      } else {
         // Jika pengguna tidak ditemukan
         res.status(401).json({ message: 'Pengguna tidak ditemukan' });
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

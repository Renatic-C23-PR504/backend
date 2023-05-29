const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Jumlah salt rounds yang digunakan untuk menghasilkan salt

const app = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');

// nangkep form jadi json
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// app.use(
//    sessions({
//       secret: 'thisismysecrctekey',
//       saveUninitialized: true,
//       cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
//       resave: false,
//    })
// );

// app.use(cookieParser());

// TODO: Sesuaikan konfigurasi database
const connection = require('../database');

let all = (req, res) => {
   const query = `select * from users`;
   connection.query(query, (err, rows, field) => {
      if (err) {
         res.status(200).send({ message: err.sqlMessage });
      } else {
         res.json(rows);
      }
   });
};

const registerUser = (req, res) => {
   var { name, email, password1, password2 } = req.body;

   if (!name || !email || !password1 || !password2) {
      return res.status(400).json({ message: 'Invalid request body' });
   }

   const ifUserExist = `SELECT * FROM users WHERE email = ?`;
   connection.query(ifUserExist, [email], (err, result) => {
      if (err) {
         return res.status(500).json({ message: err.sqlMessage });
      } else if (result.length > 0) {
         return res.status(500).json({ message: 'akun sudah ada' });
      }
      if (password1 === password2) {
         const saltRounds = 10; // Define the number of salt rounds
         bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
               return res
                  .status(500)
                  .json({ message: 'Terjadi kesalahan pada server' });
            }

            bcrypt.hash(password1, salt, (err, hash) => {
               if (err) {
                  return res
                     .status(500)
                     .json({ message: 'Terjadi kesalahan pada server' });
               }

               const queryRegister = `INSERT INTO users(nameUser, email, password1, password2) VALUES (?,?,?,?)`;
               connection.query(
                  queryRegister,
                  [name, email, hash, password2],
                  (err, result) => {
                     if (err) {
                        res.status(500).send({ message: err.sqlMessage });
                     } else {
                        res.json(result);
                     }
                  }
               );
            });
         });
      } else {
         res.status(500).json({ message: 'Password tidak sama' });
      }
   });
};

const loginUser = (req, res) => {
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
            // console.log(password);
            // console.log(user.password1);
            if (err) {
               console.error(err); // Log the error to the console for debugging
               return res
                  .status(500)
                  .json({ message: 'Terjadi kesalahan pada server' });
            }
            // Log the passwords for debugging
            // console.log('Comparing passwords:', password, user.password1);

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
         return res.status(401).json({ message: 'Pengguna tidak ditemukan' });
      }
   });
};

const profileUser = (req, res) => {
   const userProfile = `SELECT * FROM users`;
   connection.query(userProfile, (err, result) => {
      if (err) {
         res.status(500).send({ message: err.sqlMessage });
      }
      res.status(200).json({
         message: 'Data berhasil ditemukan',
         data: result,
      });
   });
};

module.exports = { all, registerUser, loginUser, profileUser };

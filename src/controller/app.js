const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Jumlah salt rounds yang digunakan untuk menghasilkan salt
const jwt = require('jsonwebtoken');
const app = express.Router();
const bodyParser = require('body-parser');
const connection = require('../database');

// nangkep form jadi json
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: false }));

const jwtkey = 'Lw8RKTPutNEPpy1mWrJx';
// TODO: Sesuaikan konfigurasi database

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
                        res.status(200).json({ message: 'Akun terdaftar' });
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

const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;

      const queryLogin = `SELECT * FROM users WHERE email = ?`;
      const result = await new Promise((resolve, reject) => {
         connection.query(queryLogin, [email], (err, result) => {
            if (err) {
               reject(err);
            } else {
               resolve(result);
            }
         });
      });

      if (result.length > 0) {
         const user = result[0];
         console.log(user);

         const isMatch = await new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password1, (err, isMatch) => {
               if (err) {
                  reject(err);
               } else {
                  resolve(isMatch);
               }
            });
         });

         if (isMatch) {
            const token = jwt.sign(
               { id: user.idUser, email: user.email },
               jwtkey
            );

            const userToken = {
               id: user.idUser,
               email: user.email,
               token: token,
            };

            res.status(201).json(userToken);
         } else {
            res.status(401).json({ message: 'Password tidak cocok' });
         }
      } else {
         return res.status(401).json({ message: 'Pengguna tidak ditemukan' });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
   }
};

const profileUser = (req, res) => {
   let { id } = req.params.id;

   const profileUserId = `SELECT * FROM users WHERE idUser = ?`;
   connection.query(profileUserId, [id], (err, rows) => {
      if (err) {
         res.status(500).send({ message: 'Data tidak ditemukan' });
      }
      res.status(200).json({
         message: 'Data berhasil ditemukan',
         result: { data: rows },
      });
   });
};

module.exports = { all, registerUser, loginUser, profileUser };

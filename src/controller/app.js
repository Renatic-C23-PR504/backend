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
      return res.status(400).json({
         error: 'true',
         message: 'Data ada yang kosong',
      });
   }

   const ifUserExist = `SELECT * FROM users WHERE email = ?`;
   connection.query(ifUserExist, [email], (err, result) => {
      if (err) {
         return res
            .status(500)
            .json({ error: 'true', message: 'Terjadi kesalahan pada server' });
      } else if (result.length > 0) {
         return res
            .status(500)
            .json({ error: 'true', message: 'Akun sudah ada' });
      }
      if (password1 === password2) {
         const saltRounds = 10; // Define the number of salt rounds
         bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) {
               return res.status(500).json({
                  error: 'true',
                  message: 'Terjadi kesalahan pada server',
               });
            }

            bcrypt.hash(password1, salt, (err, hash) => {
               if (err) {
                  return res.status(500).json({
                     error: 'true',
                     message: 'Terjadi kesalahan pada server',
                  });
               }

               const queryRegister = `INSERT INTO users(nameUser, email, password1, password2) VALUES (?,?,?,?)`;
               connection.query(
                  queryRegister,
                  [name, email, hash, password2],
                  (err, result) => {
                     if (err) {
                        res.status(500).send({
                           error: 'true',
                           message: 'Terjadi kesalahan pada server',
                        });
                     } else {
                        res.status(200).json({
                           error: 'false',
                           message: 'Akun berhasil di daftarkan',
                        });
                     }
                  }
               );
            });
         });
      } else {
         res.status(500).json({
            error: 'true',
            message: 'Password tidak sama',
         });
      }
   });
};

const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;

      const queryLogin = `SELECT * FROM users WHERE email = ?`;
      connection.query(queryLogin, [email], (err, result) => {
         if (err) {
            res.status(500).send({
               error: 'true',
               message: 'Terjadi kesalahan pada server',
            });
         }

         if (result.length > 0) {
            const user = result[0];
            console.log(user);

            bcrypt.compare(password, user.password1, (err, isMatch) => {
               if (err) {
                  res.status(500).send({
                     error: 'true',
                     message: 'Terjadi kesalahan pada server',
                  });
               }

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

                  res.status(201).json({
                     error: 'false',
                     message: 'Berhasil login',
                     data: userToken,
                  });
               } else {
                  res.status(401).json({
                     error: 'true',
                     message: 'Password tidak cocok',
                  });
               }
            });
         } else {
            res.status(401).json({
               error: 'true',
               message: 'Pengguna tidak ditemukan',
            });
         }
      });
   } catch (error) {
      console.error(error);
      return res
         .status(500)
         .json({ error: 'true', message: 'Terjadi kesalahan pada server' });
   }
};

const profileUser = (req, res) => {
   let { id } = req.params.id;

   const profileUserId = `SELECT * FROM users WHERE idUser = ?`;
   connection.query(profileUserId, [id], (err, result) => {
      if (err) {
         res.status(500).send({
            error: 'true',
            message: 'Login terlebih dahulu',
         });
      }
      res.status(200).json({
         error: 'false',
         message: 'profil ditampilkan',
         result: { data: result },
      });
   });
};

module.exports = { all, registerUser, loginUser, profileUser };

const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const Multer = require('multer');
// const imgUpload = require('../modules/imgUpload');

const multer = Multer({
   storage: Multer.MemoryStorage,
   fileSize: 5 * 1024 * 1024,
});

// TODO: Sesuaikan konfigurasi database
const connection = mysql.createConnection({
   host: 'public_ip_sql_instance_Anda',
   user: 'root',
   database: 'nama_database_Anda',
   password: 'password_sql_Anda',
});

if (!connection) {
   console.log('gagal');
}

router.get('/all', (req, res) => {
   const query = 'select * from user';
   connection.query(query, (err, rows, field) => {
      if (err) {
         res.status(200).send({ message: err.sqlMessage });
      } else {
         res.json(rows);
      }
   });
});

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

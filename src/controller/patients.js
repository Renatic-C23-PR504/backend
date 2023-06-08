const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();
const connection = require('../database');

app.use(express.json());

const addPatients = (req, res) => {
   var { name, bpjs, tanggalLahir, jkelamin, beratbadan } = req.body;

   // var { name, bpjs, birthDate, jkelamin, beratbadan } = req.body;
   // const [tahun, bulan, tanggal] = birthDate.split('-');

   // // Menghitung tanggalLahir
   // const today = new Date();
   // const birthDate = new Date(tahun, bulan - 1, tanggal);
   // const age = today.getFullYear() - birthDate.getFullYear();
   // const monthDiff = today.getMonth() - birthDate.getMonth();

   // // Memperbarui tanggalLahir jika bulan hari ini kurang dari bulan tanggal lahir
   // if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
   //    age--;
   // }

   if (!name || !bpjs || !tanggalLahir || !beratbadan) {
      return res.status(417).json({ message: 'data tidak boleh kosong' });
   }

   const ifPatientExist = `SELECT * FROM patients WHERE noPatient = ?`;
   connection.query(ifPatientExist, [bpjs], (err, result) => {
      if (err) {
         return res
            .status(500)
            .json({ error: 'true', message: 'Terjadi kesalahan pada server' });
      } else if (result.length > 0) {
         return res
            .status(400)
            .json({ error: 'true', message: 'Pasien sudah terdaftar' });
      } else {
         const addPatient = `INSERT INTO patients(namePatient, noPatient, tanggalLahir, kelamin, weightPatient) VALUES (?, ?, ?, ?, ?)`;
         connection.query(
            addPatient,
            [name, bpjs, tanggalLahir, jkelamin, beratbadan],
            (err, rows) => {
               if (err) {
                  return res.status(500).json({
                     err,
                     error: 'true',
                     message: 'Terjadi kesalahan pada server',
                  });
               } else {
                  res.status(201).json({
                     error: 'false',
                     message: 'Data pasien berhasil ditambahkan',
                  });
               }
            }
         );
      }
   });
};

let allPatients = (req, res) => {
   const query = `SELECT * FROM patients ORDER BY idPatient DESC`;
   connection.query(query, (err, rows, field) => {
      if (err) {
         return res.status(500).json({
            err,
            error: 'true',
            message: 'Terjadi kesalahan pada server',
         });
      } else {
         res.status(200).json({
            error: 'false',
            message: 'berhasil menampilkan data pasien',
            data: rows,
         });
      }
   });
};

const search = (req, res) => {
   let { bpjs } = req.body;
   if (!bpjs) {
      return res
         .status(417)
         .json({ error: 'true', message: 'data tidak boleh kosong' });
   }

   const ifPatientExist = `SELECT * FROM patients WHERE noPatient = ?`;
   connection.query(ifPatientExist, [bpjs], (err, rows) => {
      if (err) {
         return res.status(500).json({
            error: 'true',
            message: 'Terjadi kesalahan pada server',
         });
      } else if (rows.length == 0) {
         res.status(404).json({
            error: 'false',
            message: 'pasien belum terdaftar',
         });
      } else if (rows.length > 0) {
         res.status(200).json({
            error: 'false',
            message: 'pasien ditemukan',
            data: rows,
         });
      }
   });
};

const showDataPatient = (req, res) => {
   let id = req.params.id;
   const getshowDataPatient = `SELECT * FROM patients WHERE idPatient = ?`;
   connection.query(getshowDataPatient, [id], (err, rows) => {
      if (err) {
         return res.status(500).json({
            error: 'true',
            message: 'Terjadi kesalahan pada server',
         });
      }
      if (rows.length == 0) {
         return res.status(404).json({
            error: 'true',
            message: 'data tidak ditemukan',
         });
      }
      res.status(200).json({
         error: 'false',
         message: 'data ditemukan',
         data: rows,
      });
   });
};

const editPatients = (req, res) => {
   let id = req.params.id;
   const { name, bpjs, tanggalLahir, jkelamin, beratbadan } = req.body;

   const getFirst = `SELECT * FROM patients WHERE idPatient = ?`;
   connection.query(getFirst, [id], (err, rows) => {
      if (err) {
         return res.status(500).json({
            error: 'true',
            message: 'Terjadi kesalahan pada server',
         });
      }
      if (!bpjs || !name || !tanggalLahir || !jkelamin || !beratbadan) {
         return res.status(417).json({
            error: 'true',
            message: 'data tidak boleh ada yang kosong',
         });
      }
      const editPatient = `UPDATE patients SET namePatient = ?, noPatient = ?, tanggalLahir = ?, kelamin = ?, weightPatient = ? WHERE idPatient = ?`;
      connection.query(
         editPatient,
         [name, bpjs, tanggalLahir, jkelamin, beratbadan, id],
         (err, rows) => {
            if (err) {
               return res.status(500).json({
                  error: 'true',
                  message: 'Terjadi kesalahan pada server',
               });
            }
            if (rows.affectedRows == 1) {
               return res.status(202).json({
                  error: 'false',
                  message: 'data berhasil di update id:' + id,
               });
            }
         }
      );
   });
};

module.exports = {
   addPatients,
   allPatients,
   search,
   showDataPatient,
   editPatients,
};

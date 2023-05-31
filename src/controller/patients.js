const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();
const connection = require('../database');

app.use(express.json());

const addPatients = (req, res) => {
   var { name, bpjs, umur, jkelamin, beratbadan } = req.body;

   // var { name, bpjs, birthDate, jkelamin, beratbadan } = req.body;
   // const [tahun, bulan, tanggal] = birthDate.split('-');

   // // Menghitung umur
   // const today = new Date();
   // const birthDate = new Date(tahun, bulan - 1, tanggal);
   // const age = today.getFullYear() - birthDate.getFullYear();
   // const monthDiff = today.getMonth() - birthDate.getMonth();

   // // Memperbarui umur jika bulan hari ini kurang dari bulan tanggal lahir
   // if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
   //    age--;
   // }

   if (!name || !bpjs || !umur || !beratbadan) {
      return res.status(400).json({ message: 'data tidak boleh kosong' });
   }

   const ifPatientExist = `SELECT * FROM patients WHERE noPatient = ?`;
   connection.query(ifPatientExist, [bpjs], (err, result) => {
      if (err) {
         return res
            .status(500)
            .json({ error: 'true', message: 'Terjadi kesalahan pada server' });
      } else if (result.length > 0) {
         return res
            .status(500)
            .json({ error: 'true', message: 'Pasien sudah terdaftar' });
      } else {
         const addPatient = `INSERT INTO patients(namePatient, noPatient, umur, kelamin, weightPatient) VALUES (?, ?, ?, ?, ?)`;
         connection.query(
            addPatient,
            [name, bpjs, umur, jkelamin, beratbadan],
            (err, rows) => {
               if (err) {
                  return res.status(500).json({
                     err,
                     error: 'true',
                     message: 'Terjadi kesalahan pada server',
                  });
               } else {
                  res.status(200).json({
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
         .status(400)
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
         res.status(200).json({
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

const onePatient = (req, res) => {};

const editPatients = (req, res) => {
   const { idPatient, bpjs, nama, alamat, gender, tglLahir } = req.body;
   if (!idPatient || !bpjs || !nama || !alamat || !gender || !tglLahir) {
      return res.status(400).json({
         error: 'true',
         message: 'data tidak boleh ada yang kosong',
      });
   }

   const editPatient = ``;
};

module.exports = { addPatients, allPatients, search, onePatient, editPatients };

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();
const connection = require('../database');

app.use(express.json());

const addPatients = (req, res) => {
   var { name, bpjs, umur, jkelamin, beratbadan } = req.body;

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
         const addPatient = `INSERT INTO patients(namePatient, noPatient, kelamin, weightPatient) VALUES (?, ?, ?, ?)`;
         connection.query(
            addPatient,
            [name, bpjs, umur, jkelamin, beratbadan],
            (err, result) => {
               if (err) {
                  return res.status(500).json({
                     error: 'true',
                     message: 'Terjadi kesalahan pada server',
                  });
               } else {
                  res.status(200).json({
                     error: 'false',
                     message: 'Data pasien berhasil ditambahkan',
                     result: { data: result },
                  });
               }
            }
         );
      }
   });
};

let allPatients = (req, res) => {
   const query = `select * from patients`;
   connection.query(query, (err, rows, field) => {
      if (err) {
         res.status(200).send({ message: err.sqlMessage });
      } else {
         res.json(rows);
      }
   });
};

const search = (req, res) => {
   var { bpjs } = req.body;
   if (!bpjs) {
      return res.status(400).json({ message: 'data tidak boleh kosong' });
   }

   const ifPatientExist = `SELECT * FROM patients WHERE noPatient = ?`;
   connection.query(ifPatientExist, [bpjs], (err, rows, result) => {
      if (err) {
         res.status(500).send({ message: err.sqlMessage });
      } else if (result.length <= 0) {
         res.status(200).json({
            error: 'false',
            message: 'pasien belum terdaftar',
         });
      } else {
         res.status(200).json({
            error: 'false',
            message: 'pasien ditemukan',
            data: rows
         });
      }
   })
}

module.exports = { addPatients, allPatients, search };

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
         return res.status(500).json({ message: err.sqlMessage });
      } else if (result.length > 0) {
         return res.status(500).json({ message: 'pasien sudah ada' });
      } else {
         const addPatient = `INSERT INTO patients(namePatient, noPatient, kelamin, weightPatient) VALUES (?, ?, ?, ?)`;
         connection.query(
            addPatient,
            [name, bpjs, umur, jkelamin, beratbadan],
            (err, result) => {
               if (err) {
                  res.status(500).send({ message: err.sqlMessage });
               } else {
                  res.json(result);
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

module.exports = { addPatients, allPatients };

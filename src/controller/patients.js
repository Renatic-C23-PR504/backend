const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();
const connection = require('../database');

app.use(express.json());

module.exports = {};
const addPatients = (req, res) => {
   var { name, bpjs, umur, jkelamin, beratbadan } = req.body;

   const addPatient = `INSERT INTO patients(namePatient, noPatient, idKelamin, weightPatient) VALUES (?, ?, ?, ?)`;
   connection.query(
      addPatient,
      [name, bpjs, umur, jkelamin, beratbadan],
      (req, res) => {}
   );
};

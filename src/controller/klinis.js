const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();
const connection = require('../database');

app.use(express.json());

const allKlinis = (req, res) => {
   const sql =
      'SELECT k.*, p.umur FROM klinis k JOIN patients p ON k.patient = p.idPatient';
   connection.query(sql, (err, result) => {
      if (err) {
         res.status(500).send({
            error: 'true',
            message: 'Terjadi kesalahan pada server',
            err,
         });
      } else {
         res.status(201).json({
            error: 'false',
            message: 'data ditampilkan',
            result,
         });
      }
   });
};

const addKlinis = (req, res) => {
   let id = req.headers.id;
   const { pregnancies, glucose, blood, skin, insulin, bmi, diabetes } =
      req.body;
   if (
      !pregnancies ||
      !glucose ||
      !blood ||
      !skin ||
      !insulin ||
      !bmi ||
      !diabetes
   ) {
      return res.status(417).json({
         error: 'true',
         message: 'data tidak boleh ada yang kosong',
      });
   }
   addDataKlinis = `INSERT INTO klinis(patient, pregnancies, glucose, blood, skin, insulin, bmi, diabetesDegree) VALUES (?,?,?,?,?,?,?,?)`;
   connection.query(
      addDataKlinis,
      [id, pregnancies, glucose, blood, skin, insulin, bmi, diabetes],
      (err, rows) => {
         if (err) {
            res.status(500).send({
               error: 'true',
               message: 'Terjadi kesalahan pada server',
            });
         } else {
            res.status(201).json({
               error: 'false',
               message: 'data berhasil ditambahkan',
               // data: result, gatau ada result ato ga kalo post
            });
         }
      }
   );
};

const getDataKlinis = (req, res) => {
   let id = req.params.id;

   const allDataKlinis = `SELECT k.*, p.umur FROM klinis k JOIN patients p ON k.patient = p.idPatient WHERE idKlinis = ?`;
   connection.query(allDataKlinis, [id], (err, rows) => {
      if (err) {
         res.status(500).send({
            error: 'true',
            message: 'Terjadi kesalahan pada server',
         });
      } else {
         res.status(200).json({
            error: 'false',
            message: 'data berhasil diambil',
            data: rows,
         });
      }
   });
};

const getKlinisPatient = (req, res) => {
   let id = req.params.id;

   const allKlinisPatient = `SELECT * FROM klinis WHERE patient = ?`;
   connection.query(allKlinisPatient, [id], (err, rows) => {
      if (err) {
         res.status(500).send({
            error: 'true',
            message: 'Terjadi kesalahan pada server',
            err,
         });
      } else {
         res.status(200).json({
            error: 'false',
            message: 'data berhasil diambil',
            data: rows,
         });
      }
   });
};

module.exports = { allKlinis, addKlinis, getDataKlinis, getKlinisPatient };

const express = require('express');
const axios = require('axios');
const app = express.Router();
const connection = require('../database');

app.use(express.json());

const allKlinis = (req, res) => {
   const sql =
      'SELECT k.*, p.tanggalLahir FROM klinis k JOIN patients p ON k.patient = p.idPatient';
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

   const {
      Pregnancies,
      Glucose,
      BloodPressure,
      SkinThickness,
      Insulin,
      BMI,
      DiabetesPedigreeFunction,
   } = req.body;

   if (!id) {
      return res.status(417).json({
         error: 'true',
         message: 'pasien tidak ditemukan',
      });
   }

   const allowedKeys = [
      'Pregnancies',
      'Glucose',
      'BloodPressure',
      'SkinThickness',
      'Insulin',
      'BMI',
      'DiabetesPedigreeFunction',
   ];
   const receivedKeys = Object.keys(req.body);

   // Check if any received key is not allowed
   const invalidKeys = receivedKeys.filter((key) => !allowedKeys.includes(key));

   if (invalidKeys.length > 0) {
      return res.status(400).json({
         error: 'true',
         message: `key tidak sesuai: ${invalidKeys.join(', ')}`,
      });
   }
   if (
      !Pregnancies ||
      !Glucose ||
      !BloodPressure ||
      !SkinThickness ||
      !Insulin ||
      !BMI ||
      !DiabetesPedigreeFunction
   ) {
      return res.status(417).json({
         error: 'true',
         message: 'data tidak boleh ada yang kosong',
      });
   }
   const getAge = `SELECT tanggalLahir FROM patients WHERE idPatient = ?`;
   connection.query(getAge, [id], (err, rows) => {
      let id = req.headers.id;
      if (err) {
         res.status(500).send({
            error: 'true',
            message: 'Terjadi kesalahan pada server',
            err,
         });
      }
      // console.log(getAge);
      if (rows.length === 0) {
         return res.status(417).json({
            error: 'true',
            message: 'tidak ada isi',
         });
      }

      // Retrieve the birthdate from the database rows
      const birthDate = new Date(rows[0].tanggalLahir);

      // Calculate the age based on the current date
      const currentDate = new Date();
      const ageInMilliseconds = currentDate - birthDate;
      const ageInYears = Math.floor(
         ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
      );

      console.log('Age:', ageInYears);

      axios
         .post('https://clinic-nhldbkcx5q-et.a.run.app/', {
            Pregnancies,
            Glucose,
            BloodPressure,
            SkinThickness,
            Insulin,
            BMI,
            DiabetesPedigreeFunction,
            ageInYears,
         })
         .then((response) => {
            // Extract the result from the other API response
            const result = response.data;
            console.log(result);
            // Create a new API response based on the result
            // const transformedData =
            //    /* Process the result here */

            //    // Send the new API response
            //    res.json(transformedData);
            addDataKlinis = `INSERT INTO klinis(patient, pregnancies, glucose, blood, skin, insulin, bmi, diabetesDegree) VALUES (?,?,?,?,?,?,?,?)`;
            connection.query(
               addDataKlinis,
               [
                  id,
                  Pregnancies,
                  Glucose,
                  BloodPressure,
                  SkinThickness,
                  Insulin,
                  BMI,
                  DiabetesPedigreeFunction,
               ],
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
                        result,
                        // data: result, gatau ada result ato ga kalo post
                     });
                  }
               }
            );
         })
         .catch((error) => {
            // Handle errors
            return res.status(500).json({
               error: 'true',
               message: 'API tidak ditemukan',
            });
         });
   });
};

const getDataKlinis = (req, res) => {
   let id = req.params.id;

   const allDataKlinis = `SELECT * FROM dataSkrining WHERE idSkrining = ?`;
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

   const allKlinisPatient = `SELECT * FROM klinis WHERE patient = ? ORDER BY idKlinis DESC`;
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

// const getAge = `SELECT k.*, p.tanggalLahir FROM klinis k JOIN patients p ON k.patient = p.idPatient WHERE idPatient = ?`;

// const birthDate = new Date(rows[0].tanggalLahir);

// // Calculate the age based on the current date
// const currentDate = new Date();
// const ageInMilliseconds = currentDate - birthDate;
// const ageInYears = Math.floor(
//    ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
// );

// console.log('Age:', ageInYears);

const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();
const connection = require('../database');
const axios = require('axios');

const tesklinis = (req, res) => {
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
   const getAge = `SELECT k.*, p.tanggalLahir FROM klinis k JOIN patients p ON k.patient = p.idPatient WHERE idPatient = ?`;
   connection.query(getAge, [id], (err, rows) => {
      if (err) {
         console.error('Error retrieving data from the database:', err);
         return;
      }

      if (rows.length === 0) {
         console.log('No data found for the specified ID');
         return;
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
         })
         .catch((error) => {
            // Handle errors
            console.error('Error calling the other API:', error);
            res.status(500).send('Error calling the other API');
         });
   });

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
               // data: result, gatau ada result ato ga kalo post
            });
         }
      }
   );
};

module.exports = { tesklinis };

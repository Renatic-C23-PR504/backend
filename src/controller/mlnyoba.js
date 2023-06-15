const express = require('express');
const jwt = require('jsonwebtoken');
const app = express.Router();
const connection = require('../database');
const axios = require('axios');

const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const moment = require('moment');
const multerUpload = Multer({
   storage: Multer.memoryStorage(),
   limits: {
      fileSize: 5 * 1024 * 1024, // ukuran maksimum file (5MB)
   },
});

const storage = new Storage({
   projectId: 'capstone-renatic',
   keyFilename: 'credentials.json',
});

const bucketName = 'renatic-image';
const bucket = storage.bucket(bucketName);
//SELECT k.*, p.tanggalLahir FROM klinis k JOIN patients p ON k.patient = p.idPatient WHERE idPatient = ?`;
const tesklinis = (req, res) => {
   //key checking
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
      const emptyFields = [];

      if (!Pregnancies) {
         emptyFields.push('Pregnancies');
      }
      if (!Glucose) {
         emptyFields.push('Glucose');
      }
      if (!BloodPressure) {
         emptyFields.push('BloodPressure');
      }
      if (!SkinThickness) {
         emptyFields.push('SkinThickness');
      }
      if (!Insulin) {
         emptyFields.push('Insulin');
      }
      if (!BMI) {
         emptyFields.push('BMI');
      }
      if (!DiabetesPedigreeFunction) {
         emptyFields.push('DiabetesPedigreeFunction');
      }

      return res.status(417).json({
         error: 'true',
         message: 'Data cannot be empty',
         emptyFields: emptyFields,
      });
   }
   //key checking end

   //age counting
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
      //age counting end

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
            multerUpload.single('image')(req, res, (err) => {
               if (err instanceof multer.MulterError) {
                  return res.status(400).json({
                     error: 'true',
                     message: 'file tidak berhasil diupload',
                  });
               } else if (err) {
                  return res.status(500).json({
                     error: 'true',
                     message: 'terjadi kesalahan pada server',
                  });
               }

               if (!req.file) {
                  return res.status(400).json({
                     error: 'true',
                     message: 'file gambar tidak ditemukan',
                  });
               }

               const originalName = req.file.originalname;
               const fileName = Date.now() + '_' + originalName;

               const file = bucket.file(fileName);
               const stream = file.createWriteStream({
                  metadata: {
                     contentType: req.file.mimetype,
                  },
               });
            });
            stream.on('error', (err) => {
               console.error(err);
               res.status(500).send({
                  error: 'true',
                  message: 'Gagal meng-upload gambar',
               });
            });

            stream.on('finish', () => {
               axios
                  .post('https://imgrenatic-nhldbkcx5q-et.a.run.app/predict', {
                     image_url: publicUrl,
                  })
                  .then((response) => {
                     console.log('Image uploaded successfully:', response.data);
                     res.status(200).send('Image uploaded successfully');
                  })
                  .catch((error) => {
                     console.error('Error uploading image:', error);
                     res.status(500).send('Error uploading image');
                  });
            });

            addDataKlinis = `INSERT INTO dataSkrining(patient, pregnancies, glucose, blood, skin, insulin, bmi, diabetesDegree) VALUES (?,?,?,?,?,?,?,?)`;
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
                        transformedData,
                        // data: result, gatau ada result ato ga kalo post
                     });
                  }
               }
            );
         })
         .catch((err) => {
            // Handle errors
            return res.status(500).json({
               error: 'true',
               message: 'API tidak ditemukan',
               err,
            });
         });
   });
};

module.exports = { tesklinis };

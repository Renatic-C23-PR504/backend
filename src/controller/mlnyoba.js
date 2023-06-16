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

const tesklinis = (req, res) => {
   let id = req.headers.id;
   const img = req.image.publicUrl;
   const Pregnancies = parseFloat(req.data.Pregnancies);
   const Glucose = parseFloat(req.data.Glucose);
   const BloodPressure = parseFloat(req.data.BloodPressure);
   const SkinThickness = parseFloat(req.data.SkinThickness);
   const Insulin = parseFloat(req.data.Insulin);
   const BMI = parseFloat(req.data.BMI);
   const DiabetesPedigreeFunction = parseFloat(
      req.data.DiabetesPedigreeFunction
   );

   const qry = `INSERT INTO dataSkrining (patient, pregnancies,glucose,blood,skin,insulin,bmi,diabetesDegree,gambar) VALUES (?,?,?,?,?,?,?,?,?)`;
   connection.query(
      qry,
      [
         id,
         Pregnancies,
         Glucose,
         BloodPressure,
         SkinThickness,
         Insulin,
         BMI,
         DiabetesPedigreeFunction,
         img,
      ],
      (err, result) => {
         if (err) {
            res.status(500).send({
               error: 'true',
               message: 'Terjadi kesalahan pada server',
               err,
            });
         } else {
            res.status(200).send({
               error: 'false',
               message: 'berhasil',
               data: {
                  id,
                  Pregnancies,
                  Glucose,
                  BloodPressure,
                  SkinThickness,
                  Insulin,
                  BMI,
                  DiabetesPedigreeFunction,
                  img,
               },
            });
         }
      }
   );
   // console.log(img);
   // console.log(data);
   // return res.send('a');
};

const scanML = async (req, res) => {
   // const data = req.body;
   // console.log(data);
   const id = req.body.id;
   const image_url = req.body.img;
   const Pregnancies = req.body.Pregnancies;
   const Glucose = req.body.Glucose;
   const BloodPressure = req.body.BloodPressure;
   const SkinThickness = req.body.SkinThickness;
   const Insulin = req.body.Insulin;
   const BMI = req.body.BMI;
   const DiabetesPedigreeFunction = req.body.DiabetesPedigreeFunction;

   const formKlinis = await axios
      .post('https://clinic-nhldbkcx5q-et.a.run.app/', {
         Pregnancies,
         Glucose,
         BloodPressure,
         SkinThickness,
         Insulin,
         BMI,
         DiabetesPedigreeFunction,
      })
      .then((response) => {
         const result = response.data;
         // console.log(result);
         return result;
      })
      .catch((err) => {
         // Handle errors
         return res.status(500).json({
            error: 'true',
            message: 'API tidak ditemukan',
            err,
         });
      });

   const imgKlinis = await axios
      .post('https://imgrenatic-nhldbkcx5q-et.a.run.app/predict', {
         image_url,
      })
      .then((response) => {
         const imgresult = response.data;
         // console.log(result);
         return imgresult;
      })
      .catch((err) => {
         return res.status(500).json({
            error: 'true',
            message: 'API tidak ditemukan',
            err,
         });
      });
   console.log(formKlinis);
   console.log(imgKlinis);
   const resultData = {
      Pregnancies,
      Glucose,
      BloodPressure,
      SkinThickness,
      Insulin,
      BMI,
      DiabetesPedigreeFunction,
      formKlinis,
      imgKlinis,
   };
   res.send(resultData);
};

module.exports = { tesklinis, scanML };

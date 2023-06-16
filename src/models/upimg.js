const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const connection = require('../database');
const multer = require('multer');
const moment = require('moment');
const { response } = require('express');
const axios = require('axios');
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

let ImgUpload = {};
ImgUpload.upiImg = (req, res, next) => {
   multerUpload.single('image')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
         return res
            .status(400)
            .json({ error: 'true', message: 'file tidak berhasil diupload' });
      } else if (err) {
         return res
            .status(500)
            .json({ error: 'true', message: 'terjadi kesalahan pada server' });
      }

      if (!req.file) {
         return res
            .status(400)
            .json({ error: 'true', message: 'file gambar tidak ditemukan' });
      }

      const originalName = req.file.originalname;
      const fileName = Date.now() + '_' + originalName;

      const file = bucket.file(fileName);
      const stream = file.createWriteStream({
         metadata: {
            contentType: req.file.mimetype,
         },
      });

      stream.on('error', (err) => {
         console.error(err);
         res.status(500).send({
            error: 'true',
            message: 'Gagal meng-upload gambar',
         });
      });

      stream.on('finish', () => {
         let id = req.headers.id;
         const currentDate = moment().format('YYYY-MM-DD');
         console.log(id);
         const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
         req.image = { publicUrl };
         next();
      });
      stream.end(req.file.buffer);
   });
};

module.exports = {
   ImgUpload,
};

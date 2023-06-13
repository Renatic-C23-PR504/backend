require('dotenv').config();
const express = require('express');
const router = require('./routes/router');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
   res.send('hi klean smua');
});

app.use('/', router);

app.listen(port, () => {
   console.log(`http://localhost:${port}/`);
});

const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const upload = Multer({
   storage: Multer.memoryStorage(),
   limits: {
      fileSize: 5 * 1024 * 1024, // ukuran maksimum file (5MB)
   },
});

const storage = new Storage({
   projectId: 'capstone-renatic', // Ganti dengan ID proyek Google Cloud Storage Anda
   keyFilename: 'credentials.json', // Ganti dengan path ke service account key Anda
});

const bucketName = 'renatic-image'; // Ganti dengan nama bucket yang digunakan
const bucket = storage.bucket(bucketName);

app.post('/upload', upload.single('image'), (req, res, next) => {
   if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
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
      res.status(500).json({ error: 'Failed to upload file' });
   });

   stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
      res.status(200).json({
         message: 'File uploaded successfully',
         publicUrl,
      });
   });

   stream.end(req.file.buffer);
});

const Multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const connection = require('../database');
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

const uploadImage = (req, res) => {
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
         const upsql = `INSERT INTO mata (gambar, patient, date_add) VALUES (?,?,?)`;
         connection.query(
            upsql,
            [publicUrl, id, currentDate],
            (err, result) => {
               res.status(200).send({
                  error: 'false',
                  message: 'Gambar berhasil di upload',
                  publicUrl: publicUrl,
               });
            }
         );
      });
      stream.end(req.file.buffer);
   });
};

const showImagesId = (req, res) => {
   let id = req.params.id;
   const showimg = `SELECT * FROM mata WHERE patient = ? ORDER BY  idMata DESC`;
   connection.query(showimg, [id], (err, rows) => {
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

const showMataImg = (req, res) => {
   let id = req.params.id;
   const showimg = `SELECT * FROM mata WHERE idMata = ?`;
   connection.query(showimg, [id], (err, rows) => {
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

module.exports = {
   uploadImage,
   showImagesId,
   showMataImg,
};

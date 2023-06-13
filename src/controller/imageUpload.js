// const express = require('express');
// const multer = require('multer');
// const { Storage } = require('@google-cloud/storage');

// const app = express();
// const upload = multer({ dest: 'uploads/' });

// const storage = new Storage({
//     projectId: 'capstone-renatic',
//     keyFilename: 'credentials.json', 
// });

// const bucketName = 'renatic-image';
// const bucket = storage.bucket(bucketName);

// app.post('/upload', upload.single('file'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const fileName = req.file.originalname;
//     const file = bucket.file(fileName);

//     const stream = file.createWriteStream({
//         resumable: false,
//         contentType: req.file.mimetype,
//     });

//     stream.on('error', (err) => {
//         console.error(err);
//         res.status(500).json({ error: 'Failed to upload file' });
//     });

//     stream.on('finish', () => {
//         res.status(200).json({ message: 'File uploaded successfully' });
//     });

//     stream.end(req.file.buffer);
// });
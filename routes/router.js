const express = require('express');
const auth = require('../src/auth');
// const userController = require('../src/controller/app');
const router = express.Router();
const {
   all,
   registerUser,
   loginUser,
   profileUser,
} = require('../src/controller/app');
router.use(express.json());
const {
   addPatients,
   allPatients,
   search,
   editPatients,
   showDataPatient,
} = require('../src/controller/patients');
const {
   allKlinis,
   addKlinis,
   getDataKlinis,
   getKlinisPatient,
} = require('../src/controller/klinis');
// const { uploadIMG } = require('../imageUpload');
const {
   uploadImage,
   showImagesId,
   showMataImg,
} = require('../src/controller/imageUpload');

const { tesklinis, scanML } = require('../src/controller/mlnyoba');
//testing
router.get('/all', all);

//user
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', auth, profileUser);

//patient
router.post('/addpatient', auth, addPatients);
router.get('/patient', auth, allPatients);
router.post('/search', auth, search);
router.post('/editpatient/:id', auth, editPatients);
router.get('/showdatapatient/:id', auth, showDataPatient);

//ML
router.post('/tesklinis', uploadImage, tesklinis);
router.post('/scanml', scanML);

//klinis
router.get('/allKlinis', allKlinis);
router.post('/addklinis', addKlinis);
router.get('/dataklinis/:id', getDataKlinis);
router.get('/klinispatient/:id', getKlinisPatient);

router.post('/upload', uploadImage);
router.get('/historymata/:id', showImagesId);
router.get('/mata/:id', showMataImg);

module.exports = router;

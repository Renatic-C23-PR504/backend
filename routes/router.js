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
   onePatient,
} = require('../src/controller/patients');

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
router.post('/editpatient', auth, editPatients);
router.get('/onepatient/:id', auth, onePatient);

module.exports = router;

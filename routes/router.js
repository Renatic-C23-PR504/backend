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
const { addPatients, allPatients } = require('../src/controller/patients');

router.get('/all', all);
router.get('/allp', allPatients);
router.post('/register', registerUser);
router.get('/login', loginUser);
router.get('/profile/:id', auth, profileUser);
router.post('/patient', auth, addPatients);

module.exports = router;

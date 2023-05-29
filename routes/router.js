const express = require('express');
// const userController = require('../src/controller/app');
const router = express.Router();
const {
   all,
   registerUser,
   loginUser,
   profileUser,
} = require('../src/controller/app');
router.use(express.json());

router.get('/all', all);
router.post('/register', registerUser);
router.get('/login', loginUser);
router.get('/profile/:id', profileUser);

module.exports = router;

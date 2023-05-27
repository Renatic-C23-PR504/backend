const express = require('express');
// const userController = require('../src/controller/app');
const router = express.Router();
const { all, registerUser, loginUser } = require('../src/controller/app');
router.use(express.json());

router.get('/all', all);
router.post('/register', registerUser);
router.get('/login', loginUser);
// // CREATE - POST
// router.post('/', userController.createNewUser);

// // READ - GET
// router.get('/', userController.getAllUsers);

// // SELECT - GET
// router.get('/:idUser', userController.selectUser);

module.exports = router;

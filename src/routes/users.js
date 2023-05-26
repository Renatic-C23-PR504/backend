const express = require('express');

const userController = require('../controller/users')

const router = express.Router();

// CREATE - POST 
router.post('/', userController.createNewUser)

// READ - GET
router.get('/', userController.getAllUsers)

// SELECT - GET
router.get('/:idUser', userController.selectUser)


module.exports = router;
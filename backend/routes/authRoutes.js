const express = require('express')
const { registerController, loginController } = require('../controllers/authControllers')

const router = express.Router()

//routes
//Register
router.post('/register', registerController); //authenticates at CONTROLLER 

//Login || Post
router.post('/login', loginController);


module.exports = router
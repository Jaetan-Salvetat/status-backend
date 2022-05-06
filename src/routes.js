const express = require('express')
const multer = require('multer')({dest: '../temp'})
const authController = require('./controllers/auth')
const authRouter = express.Router()

//Auth
authRouter.post('/register', authController.register)

module.exports = {
    auth: authRouter
}
const express = require('express')
const multer = require('multer')({dest: '../temp'})
const authController = require('./controllers/auth')
const authRouter = express.Router()

//Auth
authRouter.post('/register', authController.register)
authRouter.post('/login', authController.login)
authRouter.post('/user', authController.getUserInfos)
authRouter.put('/update', authController.update)
authRouter.delete('/remove', authController.remove)

module.exports = {
    auth: authRouter
}
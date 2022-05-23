const express = require('express')
const multer = require('multer')({dest: './temp'})
const authController = require('./controllers/auth')
const filesController = require('./controllers/upload')

const authRouter = express.Router()
const uploadRouter = express.Router()

//Auth
authRouter.post('/login', authController.login)
authRouter.post('/register', authController.register)
authRouter.post('/user', authController.getUserInfos)
authRouter.post('/validate-user-session', authController.validateUserSession)
authRouter.put('/update', authController.update)
authRouter.delete('/remove', authController.remove)


//Upload
uploadRouter.post('/profile-picture', multer.single('picture'), filesController.profilePicture)

module.exports = {
    auth: authRouter,
    upload: uploadRouter
}
const express = require('express')
const multer = require('multer')({dest: './temp'})
const authController = require('../controllers/auth')
const filesController = require('../controllers/upload')
const followController = require('../controllers/follow')
const usersController = require('../controllers/users')
const statusController = require('../controllers/status')

const authRouter = express.Router()
const usersRouter = express.Router()
const statusRouter = express.Router()
const uploadRouter = express.Router()
const followRouter = express.Router()

//Auth
authRouter.post('/login', authController.login)
authRouter.post('/register', authController.register)
authRouter.post('/validate-user-session', authController.validateUserSession)
authRouter.put('/update', authController.update)
authRouter.delete('/remove', authController.remove)

//Users
usersRouter.post('/me', usersController.getUserInfos)
usersRouter.get('/search/:username', usersController.searchUsers)
usersRouter.post('/followers', usersController.findUserFollows)

//Status
statusRouter.post('/', statusController.updateStatus)

//Upload
uploadRouter.post('/profile-picture', multer.single('picture'), filesController.profilePicture)

//Follow
followRouter.post('/', followController.follow)
followRouter.post('/remove', followController.unfollow)


module.exports = {
    users: usersRouter,
    auth: authRouter,
    upload: uploadRouter,
    follow: followRouter
}
const express = require('express')
const multer = require('multer')({dest: './temp'})
const authController = require('../controllers/auth')
const filesController = require('../controllers/upload')
const followController = require('../controllers/follow')
const usersController = require('../controllers/users')

const authRouter = express.Router()
const usersRouter = express.Router()
const uploadRouter = express.Router()
const followRouter = express.Router()

//Auth
authRouter.post('/login', authController.login)
authRouter.post('/register', authController.register)
authRouter.post('/user', authController.getUserInfos)
authRouter.post('/validate-user-session', authController.validateUserSession)
authRouter.put('/update', authController.update)
authRouter.delete('/remove', authController.remove)


usersRouter.get('/search/:username', usersController.searchUsers)
usersRouter.post('/followers', usersController.findUserFollows)

//Upload
uploadRouter.post('/profile-picture', multer.single('picture'), filesController.profilePicture)

//Follow
followRouter.post('/', followController.follow)
followRouter.delete('/unfollow', followController.unfollow)


module.exports = {
    users: usersRouter,
    auth: authRouter,
    upload: uploadRouter,
    follow: followRouter
}
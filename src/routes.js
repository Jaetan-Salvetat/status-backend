const express = require('express')
const multer = require('multer')({dest: '../temp'})
const authRouter = express.Router()



module.exports = {
    auth: authRouter
}
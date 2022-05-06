const express = require('express')
const router = require('./src/routes')
const server = express()

global.rootDir = __dirname

server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use('/auth', router.auth)
server.listen(3000)
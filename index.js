const express = require('express')
const router = require('./src/routes')
const server = express()

global.pathname = __dirname

server.use(express.urlencoded{extended: true})
server.use('/auth', router.auth)
server.use('/files', router.files)
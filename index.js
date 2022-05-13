const express = require('express')
const fs = require('fs')
const router = require('./src/routes')
const server = express()

global.rootDir = __dirname

fs.mkdir(`${rootDir}/temp`, (err) => {})

server.use(express.json())
server.use(express.urlencoded({extended: true}))
server.use('/auth', router.auth)
server.use('/upload', router.upload)
server.listen(3000)
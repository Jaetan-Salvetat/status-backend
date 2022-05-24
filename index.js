const express = require('express')
const fs = require('fs')

const apiRoutes = require('./src/routes/api')
const ws = require('./src/routes/ws')
const { app, server, io } = require('./server')



global.rootDir = __dirname

fs.mkdir(`${rootDir}/temp`, () => {})


io.on('connection', async (socket) => {
    await ws(socket)
})


//Express.js
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', apiRoutes.auth)
app.use('/upload', apiRoutes.upload)
app.use('/follow', apiRoutes.follow)

server.listen(3000)
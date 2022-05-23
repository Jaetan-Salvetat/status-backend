const express = require('express')
const http = require("http")
const socket_io = require('socket.io')
const fs = require('fs')

const router = require('./src/expressRoutes')
const requestStatus = require('./src/misc/requestStatus')
const { validateToken } = require('./src/misc/user')
const {User} = require("./src/sequelize");
const getFollows = require('./src/crud/follows').read
const findUser = require('./src/crud/users').read

const app = express()
const server = http.createServer(app)
const io = new socket_io.Server(server)

global.rootDir = __dirname

fs.mkdir(`${rootDir}/temp`, () => {})


io.on('connection', async (socket) => {
    const username = socket.handshake.query.username
    const token = socket.handshake.query.token

    //user is connected
    if(!validateToken(token, username)){
        socket.disconnect(true)
    }

    const user = await findUser(null, username)

    //add user to all follows channel
    if(user instanceof User){
        const follows = await getFollows(null, user.id)
        for(let f of follows){
            socket.join((await findUser(user.id, null)).username)
        }
        socket.join(username)
    }else{//user is not valid
        socket.disconnect(true)
    }

    socket.on('edit-status', (body) => {
        if(body.token === undefined || body.username === undefined || body.status === undefined){
            return io.to(body.username)
                .emit('edit-status', {
                    'msg': requestStatus.badContent
                })
        }


        io.to(body.username)
            .emit('edit-status', {
                'newStatus': body.status,
                "msg": requestStatus.success
            })
    })
})


//Express.js
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/auth', router.auth)
app.use('/upload', router.upload)
server.listen(3000)
const express = require("express")
const http = require("http")
const socket_io = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new socket_io.Server(server)

module.exports = {
    server,
    app,
    io
}
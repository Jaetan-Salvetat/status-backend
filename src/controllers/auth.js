const crud = require('../crud/users')
const { authStatus } = require('../misc/userMisc')

async function register(req, res) {
    res.send(await crud.create(req.body.username, req.body.email, req.body.password))
}

async function login(req, res) {
    user = await crud.read(null, '')
}

module.exports = {
    register
}
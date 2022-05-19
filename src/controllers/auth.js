const bcrypt = require('bcrypt')
const crud = require('../crud/users')
const { createToken, validateToken } = require('../misc/user')
const { User } = require('../sequelize')
const authStatus = require('../misc/requestStatus')

async function register(req, res) {
    if(req.body.email === undefined
    || req.body.username === undefined
    || req.body.password === undefined){
        return res.send({msg: authStatus.badContent})
    }


    const user = await crud.create(req.body.username, req.body.email, req.body.password)


    if(user instanceof User){
        return res.send({
            msg: authStatus.success,
            username: user.username,
            token: createToken(user.id, user.username, user.email)
        })
    }

    res.send(user)
}

async function login(req, res) {
    let auth = req.body.auth

    if( req.body.auth === undefined && req.body.password === undefined){
        return res.send({msg: authStatus.badContent})
    }

    const user = await crud.read(null, auth)

    if(user instanceof User){
        const goodPassword = await bcrypt.compare(req.body.password, user.password)
        if(!goodPassword) return res.send(authStatus.badUser)
        return res.send({
            msg: authStatus.success,
            username: user.username,
            token: createToken(user.id, user.username, user.email)
        })
    }

    res.send({msg: authStatus.badUser})
}

async function getUserInfos(req, res) {
    if(validateToken(req.body.token, req.body.username)){
        return res.send(await crud.read(null, req.body.username, null))
    }
    res.send({msg: authStatus.badContent})
}

async function update(req, res){
    if(!validateToken(req.body.token, req.body.username)){
        return res.send({msg: authStatus.badContent})
    }
    
    let user = {}

    user.email = req.body.email
    user.username = req.body.username
    user.newUsername = req.body.newUsername
    user.tag = req.body.tag
    user.password = req.body.password
    user.profilePicture = req.body.profilePicture
    user.description = req.body.description

    res.send(crud.update(user))
}

async function remove(req, res){
    if(!validateToken(req.body.token, req.body.username)){
        return res.send(authStatus.badContent)
    }

    crud.remove(req.body.username)
    res.send(authStatus.success)
}

module.exports = {
    register,
    login,
    getUserInfos,
    update,
    remove
}
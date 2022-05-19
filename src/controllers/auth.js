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
        if(!goodPassword) return res.send({msg: authStatus.badUser})

        return res.send({
            msg: authStatus.success,
            username: user.username,
            token: createToken(user.id, user.username, user.email)
        })
    }

    res.send(user)
}

async function getUserInfos(req, res) {
    if(req.body.username === undefined || req.body.token === undefined){
        return res.send({msg: authStatus.badContent})
    }

    if(validateToken(req.body.token, req.body.username)){
        let user = await crud.read(null, req.body.username)
        user.password = null
        return res.send({
            user: user,
            msg: authStatus.success
        })
    }
    res.send({msg: authStatus.badToken})
}

async function update(req, res){
    if(req.body.username === undefined || req.body.token === undefined){
        return res.send({msg: authStatus.badContent})
    }

    if(!validateToken(req.body.token, req.body.username)){
        return res.send({msg: authStatus.badToken})
    }
    
    let user = {}

    user.email = req.body.email
    user.username = req.body.username
    user.newUsername = req.body.newUsername
    user.tag = req.body.tag
    user.password = req.body.password
    user.profilePicture = req.body.profilePicture
    user.description = req.body.description

    user = await crud.update(user)

    if(user instanceof User){
        return res.send({
            msg: authStatus.success,
            username: user.username,
            token: createToken(user.id, user.username, user.email)
        })
    }

    res.send({
        msg: authStatus.error
    })
}

async function remove(req, res){
    if(req.body.username === undefined || req.body.token === undefined){
        return res.send({msg: authStatus.badContent})
    }

    if(!validateToken(req.body.token, req.body.username)){
        return res.send({msg: authStatus.badToken})
    }

    const hasRemoved = await crud.remove(req.body.username)

    if(hasRemoved){
        return res.send({msg: authStatus.success})
    }

    res.send({msg: authStatus.error})
}

module.exports = {
    register,
    login,
    getUserInfos,
    update,
    remove
}
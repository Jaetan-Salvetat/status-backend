const bcrypt = require('bcrypt')
const crud = require('../crud/users')
const { authStatus, createToken, validateToken } = require('../misc/userMisc')
const { User } = require('../sequelize')

async function register(req, res) {
    if(req.body.email === undefined
    || req.body.username === undefined
    || req.body.password === undefined){
        return res.send(authStatus.badContent)
    }


    const user = await crud.create(req.body.username, req.body.email, req.body.password)


    if(user instanceof User){
        console.log(typeof user);
        console.log(user);
        return res.send({
            username: user.username,
            token: createToken(user.id, user.username, user.email)
        })
    }

    res.send(authStatus.badContent)
}

async function login(req, res) {
    let email = req.body.email
    let username = req.body.username

    if((req.body.username === undefined || req.body.email === undefined) && req.body.password === undefined){
        console.log(req.body.email);
        return res.send(authStatus.badContent)
    }
    
    if(email === undefined) email = null
    if(username === undefined) username = null

    console.log(username);

    const user = await crud.read(null, username, email)

    if(user instanceof User){
        const goodPassword = await bcrypt.compare(req.body.password, user.password)
        if(!goodPassword) return res.send(authStatus.badUser)
        return res.send({
            username: user.username,
            token: createToken(user.id, user.username, user.email)
        })
    }

    res.send(authStatus.badUser)
}

async function getUserInfos(req, res) {
    if(validateToken(req.body.token, req.body.username)){
        return res.send(await crud.read(null, req.body.username, null))
    }
    res.send(authStatus.badContent)
}

async function update(req, res){
    if(!validateToken(req.body.token, req.body.username)){
        return res.send(authStatus.badContent)
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
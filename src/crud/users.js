const bcrypt = require('bcrypt')
const { User } = require('../sequelize')
const userMisc = require('../misc/userMisc');
const { Op } = require('sequelize');
const res = require('express/lib/response');

const salt = 10
const passwordLen = 8
const usernameLen = 3


async function create(username, email, password){
    if(!userMisc.validateEmail(email)){
        return userMisc.authStatus.badEmail
    }
    else if(username.length < 3){
        return userMisc.authStatus.shortUsername
    }
    else if(password.length < passwordLen){
        return userMisc.authStatus.shortPassword
    }
    else if(await userMisc.emailAlreadyUse(email)){
        return userMisc.authStatus.emailAlreadyUse
    }
    else if(await userMisc.usernameAlreadyUse(username)){
        return userMisc.authStatus.usernameAlreadyUse
    }
    const hash = await bcrypt.hash(password, salt)
    return await User.create({username, email, password: hash})
}

async function read(id, username, email){
    return await User.findOne({
        where: {
            [Op.or]: {
                id,
                username,
                email,
            }
        }
    })
}

async function update(u){
    if(u.username === undefined || u.username === null){
        return userMisc.authStatus.badContent
    }

    let user = await User.findOne({
        where: {username: u.username}
    })


    if(u.email != null && u.email != undefined && u.email != user.email){
        user.email = u.email
    }
    if(u.tag != null && u.tag != undefined && u.tag != user.tag){
        user.tag = u.tag
    }
    if(u.profilePicture != null && u.profilePicture != undefined && u.profilePicture != user.profilePicture){
        user.profilePicture = u.profilePicture
    }
    if(u.description != null && u.description != undefined && u.description != user.description){
        user.description = u.description
    }

    if(u.newUsername != null && u.newUsername != undefined && u.newUsername != user.username){
        if(u.username.length < usernameLen){
            return userMisc.authStatus.shortUsername
        }
        user.username = u.username
    }
    
    if(u.password != null && u.password != undefined){
        if((await bcrypt.compare(u.password, user.password))){
            return userMisc.authStatus.badPassword
        }
        if(u.password.length < 8){
            return userMisc.authStatus.shortPassword
        }
        user.password = await bcrypt.hash(u.password, salt)
    }

    return await user.save()
}

async function remove(username){
    User.destroy({
        where: {username}
    })
}

module.exports = {
    create,
    read,
    update,
    remove
}
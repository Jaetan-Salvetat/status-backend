const bcrypt = require('bcrypt')
const { User } = require('../sequelize')
const userMisc = require('../misc/userMisc');

const salt = 10


async function create(username, email, password){
    if(username === null || username === undefined
    || email === null || email === undefined
    || password === null || password === undefined){
        return userMisc.authStatus.badContent
    }
    else if(!userMisc.emailVerification(email)){
        return userMisc.authStatus.badEmail
    }
    else if(username.length < 3){
        return userMisc.authStatus.shortUsername
    }
    else if(password.length < 8){
        return userMisc.authStatus.shortPassword
    }
    else if(await userMisc.emailAlreadyUse(email)){
        return userMisc.authStatus.emailAlreadyUse
    }
    else if(await userMisc.usernameAlreadyUse(username)){
        return userMisc.authStatus.usernameAlreadyUse
    }
    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({username, email, password: hash})
    return userMisc.createToken(user.id, username, email, user.password)
}

async function read(id, username, email){
}

async function update(user){

}

async function remove(user){

}

module.exports = {
    create,
    read,
    update,
    remove
}
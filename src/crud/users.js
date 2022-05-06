const bcrypt = require('bcrypt')
const { User } = require('../sequelize')
const userMisc = require('../misc/userMisc');
const { Op } = require('sequelize');

const salt = 10


async function create(username, email, password){
    if(!userMisc.emailVerification(email)){
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
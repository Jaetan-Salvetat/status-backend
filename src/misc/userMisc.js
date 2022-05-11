const jwt = require('jsonwebtoken')
const { User } = require('../sequelize')

function validateEmail(email) {
    return email
        .toLowerCase()
        .match(/\S+@\S+\.\S+/)
}

async function emailAlreadyUse(email) {
    return await User.findOne({ where: { email } }) !== null
}

async function usernameAlreadyUse(username) {
    return await User.findOne({ where: { username } }) !== null
}

function createToken(id, username, email){
    return jwt.sign({id, username, email}, username)
}

function validateToken(token, username){
    try{
        jwt.verify(token, username)
        if(User.findOne({ where: { username } }) !== null) return true
        return false
        
    }catch(e){
        return false
    }
}



const authStatus = {
    emailAlreadyUse: 'email-already-use',
    usernameAlreadyUse: 'username-already-use',
    shortPassword: 'short-password',
    shortUsername: 'short-username',
    badEmail: 'bad-email',
    badContent: 'bad-content',
    badUser: 'bad-user',
    badPassword: 'bad-password',
    success: 'success'
}


module.exports = {
    validateEmail,
    emailAlreadyUse,
    usernameAlreadyUse,
    createToken,
    validateToken,
    authStatus,
}
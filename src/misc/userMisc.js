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

function validateToken(token){
    return true
}



const authStatus = {
    emailAlreadyUse: 'email-already-use',
    usernameAlreadyUse: 'username-already-use',
    shortPassword: 'short-password',
    shortUsername: 'short-username',
    badEmail: 'bad-email',
    badContent: 'bad-content',
    badUser: 'bad-user'
}


module.exports = {
    validateEmail,
    emailAlreadyUse,
    usernameAlreadyUse,
    createToken,
    validateToken,
    authStatus,
}
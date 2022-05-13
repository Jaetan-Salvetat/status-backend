const jwt = require('jsonwebtoken')
const { key } = require('../../data')
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
    return jwt.sign({id, username, email}, key + username)
}

function validateToken(token, username){ 
    try{
        jwt.verify(token, key + username)
        if(User.findOne({ where: { username } }) !== null) return true
        return false
        
    }catch(e){
        return false
    }
}


module.exports = {
    validateEmail,
    emailAlreadyUse,
    usernameAlreadyUse,
    createToken,
    validateToken,
}
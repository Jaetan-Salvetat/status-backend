const jwt = require('jsonwebtoken')
const { key } = require('../../data')
const { User } = require('../sequelize')

/**
 *
 * @param email {string}
 * @returns {boolean|RegExpMatchArray}
 */
function validateEmail(email) {
    return email
        .toLowerCase()
        .match(/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/)
}

/**
 *
 * @param email {string}
 * @returns {Promise<boolean>}
 */
async function emailAlreadyUse(email) {
    return await User.findOne({ where: { email } }) !== null
}

/**
 *
 * @param username {string}
 * @returns {Promise<boolean>}
 */
async function usernameAlreadyUse(username) {
    return await User.findOne({ where: { username } }) !== null
}

/**
 *
 * @param id {number}
 * @param username {string}
 * @param email {email}
 * @returns {string|null}
 */
function createToken(id, username, email){
    return jwt.sign({id, username, email}, key + username, null, null)
}

/**
 *
 * @param token {string}
 * @param username {string}
 * @returns {boolean}
 */
function validateToken(token, username){ 
    try{
        jwt.verify(token, key + username)
        return User.findOne({where: {username}}) !== null;

        
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
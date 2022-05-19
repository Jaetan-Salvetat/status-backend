const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const userMisc = require('../misc/user')
const { User } = require('../sequelize')
const createStatus = require('./status').create
const authStatus = require('../misc/requestStatus')

const salt = 10
const passwordLen = 8
const usernameLen = 3

/**
 *
 * @param username {string}
 * @param email {string}
 * @param password {string}
 * @returns {Promise<User|{msg: string}>}
 */
async function create(username, email, password){
    if(!userMisc.validateEmail(email)){
        return {
            msg: authStatus.badEmail
        }
    }
    else if(username.length < 3){
        return {
            msg: authStatus.shortUsername
        }
    }
    else if(password.length < passwordLen){
        return {
            msg: authStatus.shortPassword
        }
    }
    else if(await userMisc.emailAlreadyUse(email)){
        return {
            msg: authStatus.emailAlreadyUse
        }
    }
    else if(await userMisc.usernameAlreadyUse(username)){
        return {
            msg: authStatus.usernameAlreadyUse
        }
    }

    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({username, email, password: hash})
    await createStatus(user.id, "online", null)

    return user
}


/**
 *
 * @param id {number|null}
 * @param auth {string|null}
 * @returns {Promise<User|{msg: string}>}
 */
async function read(id, auth){
    const user = await User.findOne({
        where: {
            [Op.or]: {
                id,
                username: auth,
                email: auth,
            }
        }
    })

    if(user === null){
        return {
            msg: authStatus.badUser
        }
    }

    return user
}


/**
 *
 * @param u {User|any}
 * @returns {Promise<*|{msg: string}>}
 */
async function update(u){
    let user = await User.findOne({
        where: {username: u.username}
    })

    if(user === null){
        return {msg: authStatus.badUser}
    }

    if(u.email !== null && u.email !== undefined && u.email !== user.email){
        user.email = u.email
    }
    if(u.tag !== null && u.tag !== undefined && u.tag !== user.tag){
        user.tag = u.tag
    }
    if(u.profilePicture !== null && u.profilePicture !== undefined && u.profilePicture !== user.profilePicture){
        user.profilePicture = u.profilePicture
    }
    if(u.description !== null && u.description !== undefined && u.description !== user.description){
        user.description = u.description
    }

    if(u.newUsername !== null && u.newUsername !== undefined && u.newUsername !== user.username){
        if(u.username.length < usernameLen){
            return {
                msg: authStatus.shortUsername
            }
        }
        user.username = u.username
    }
    
    if(u.password !== null && u.password !== undefined){
        if((await bcrypt.compare(u.password, user.password))){
            return {
                msg: authStatus.badPassword
            }
        }
        if(u.password.length < 8){
            return {
                msg: authStatus.shortPassword
            }
        }
        user.password = await bcrypt.hash(u.password, salt)
    }

    await user.save()
    return user
}


/**
 *
 * @param username
 * @returns {Promise<string|{msg: string}>}
 */
async function remove(username){
    const userId = await User.destroy({
        where: {username}
    })

    if(userId === null || userId === undefined){
        return {msg: authStatus.badUser}
    }

    return authStatus.success
}

module.exports = {
    create,
    read,
    update,
    remove
}
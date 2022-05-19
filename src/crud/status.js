const { Status, User } = require('../sequelize')
const requestStatus = require('../misc/requestStatus')

/**
 *
 * @param userId {number}
 * @param name {string}
 * @param icon {string|null}
 * @return {Promise<string>}
 */

async function create(userId, name, icon){
    const user = await User.findOne({
        where: {id: userId}
    })

    if(user == null){
        return requestStatus.badUser
    }

    const status = await Status.create({userId, name, icon})

    if(status instanceof Status){
        return requestStatus.success
    }
    return requestStatus.error
}

/**
 *
 * @param userId {number}
 * @returns {Promise<Array<Status>|{msg:string}>}
 */
async function read(userId){
    const status = await Status.findAll({
        where: {
            userId
        }
    })

    if(!status.length){
        return {msg: requestStatus.badUser}
    }
    return status
}

/**
 *
 * @param statusId {number}
 * @return {string}
 */
function update(statusId){
    return requestStatus.badStatus
}

/**
 *
 * @param statusId {number}
 * @return {string}
 */
function remove(statusId){
    return requestStatus.badStatus
}

module.exports = {
    create,
    read,
    update,
    remove
}
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
 * @param userId {number}
 * @param s {Status|any}
 * @return {Promise<string>}
 */
async function update(userId, s){
    const status = await Status.findOne({
        where: {userId}
    })

    if(status === null){
        return requestStatus.badStatus
    }

    if(s.name !== undefined && s.name !== null){
        status.name = s.name
    }

    if(s.type !== undefined && s.type != null){
        if(s.type === 'online' || s.type === 'away' || s.type === 'offline'){
            status.type = s.type
        }
    }

    status.save()
    return requestStatus.success
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
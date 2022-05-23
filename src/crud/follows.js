const { Op } = require('sequelize')
const { Follow } = require('../sequelize')
const requestStatus = require('../misc/requestStatus')


/**
 *
 * @param followed {number}
 * @param follower {number}
 * @return {Promise<string>}
 */
async function create(followed, follower){
    const follow = await Follow.create({followed, follower, notification: true})

    if(follow instanceof  Follow){
        return requestStatus.success
    }

    return requestStatus.badUser
}


/**
 *
 * @param followed {number|null}
 * @param follower {number|null}
 * @return {Promise<Array<Follow>>}
 */
async function read(followed, follower) {
    if (followed != null) {
        return await Follow.findAll({
            where: {
                followed
            }
        })
    }
    return await Follow.findAll({
        where: {
            follower
        }
    })
}

async function remove(follower, followed) {
    await Follow.destroy({
        where: {
            [Op.and]: {
                followed,
                follower
            }
        }
    })
}

module.exports = {
    create,
    read,
    remove
}
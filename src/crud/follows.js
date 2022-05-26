const { Op } = require('sequelize')
const { Follow, User, Status} = require('../sequelize')
const requestStatus = require('../misc/requestStatus')


/**
 *
 * @param followed {number}
 * @param follower {number}
 * @return {Promise<string>}
 */
async function create(followed, follower){
    if((await read(followed, follower)).length > 0){
        return requestStatus.userAlreadyFollowed
    }
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
    if (followed === null || follower === null) {
        return await Follow.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username', 'profilePicture'],
                    include: [{model: Status}]
                }
            ],
            where: {
                [Op.or]: {
                    follower,
                    followed
                }
            }
        })
    }

    return await Follow.findAll({
        where: {
            [Op.and]: {
                follower,
                followed
            }
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
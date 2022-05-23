const { Op } = require('sequelize')
const { Follow } = require('../sequelize')


/**
 *
 * @param followed {number}
 * @param follower {number}
 * @return {Promise<void>}
 */
async function create(followed, follower){
    await Follow.create({followed, follower, notification: true})
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

function update(link){

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
    update,
    remove
}
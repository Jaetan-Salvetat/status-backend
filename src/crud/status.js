const { Status, User } = require('../sequelize')
const { status } = require('../misc/requestStatus')


async function create(userId, name, icon){
    const user = await User.findOne({
        where: {id: userId}
    })

    if(user == null){
        return status.badUser
    }

    await Status.create({userId, name, icon})
    return status.success
}

function read(statusId, userId){

}

function update(status){

}

function remove(statusId){

}

module.exports = {
    create,
    read,
    update,
    remove
}
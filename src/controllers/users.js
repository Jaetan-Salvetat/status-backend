const crud = require('../crud/users')
const requestStatus = require('../misc/requestStatus')
const { validateToken } = require('../misc/user')
const {User} = require("../sequelize")
const { read: findFollows } = require('../crud/follows')

async function searchUsers(req, res){
    if(req.params.username === undefined || req.params.username === null){
        return res.send(requestStatus.badContent)
    }

    res.send({
        users: await crud.findMany(req.params.username),
        msg: requestStatus.success
    })
}

async function findUserFollows(req, res) {
    if(req.body.username === undefined || req.body.token === undefined){
        return res.send({msg: requestStatus.badContent})
    }

    if(!validateToken(req.body.token, req.body.username)){
        return res.send({msg: requestStatus.badToken})
    }

    const user = await crud.read(null, req.body.username)

    if(!(user instanceof User)){
        return res.send({msg: requestStatus.badUser})
    }

    const follows = await findFollows(null, user.id)

    res.send({
        users: follows,
        msg: requestStatus.success
    })
}

module.exports = {
    searchUsers,
    findUserFollows
}
const crud = require('../crud/users')
const requestStatus = require('../misc/requestStatus')
const { validateToken } = require('../misc/user')
const {User, Status, Follow} = require("../sequelize")

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

    const user = await User.findOne({
        where: {
            username: req.body.username,
        },
        attributes: ['id']
    })


    if(!(user instanceof User)){
        return res.send({msg: requestStatus.badUser})
    }


    const follows = await Follow.findAll({
        where: {
            follower: user.id
        },
        attributes: ['followed']
    })

    const users = await User.findAll({
        where: {
            id: follows.map(f => f.followed)
        },
        attributes: [ 'username', 'profilePicture' ],
        include: [
            {model: Status}
        ]
    })


    res.send({
        users,
        msg: requestStatus.success
    })
}

module.exports = {
    searchUsers,
    findUserFollows
}
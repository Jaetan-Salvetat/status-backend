const crud = require('../crud/users')
const requestStatus = require('../misc/requestStatus')
const { validateToken } = require('../misc/user')
const {User, Status, Follow} = require("../sequelize")
const authStatus = require("../misc/requestStatus");
const {Op} = require("sequelize");


async function getUserInfos(req, res) {
    if(req.body.username === undefined || req.body.token === undefined){
        return res.send({msg: authStatus.badContent})
    }

    if(!validateToken(req.body.token, req.body.username)){
        return res.send({msg: authStatus.badToken})
    }
    let user = await User.findOne({
        where: {
            username: req.body.username
        },
        attributes: ['id', 'username', 'profilePicture', 'description'],
        include: [
            {model: Status}
        ],
    })

    let follower = await Follow.findAll({
        where: {
            followed: user.id
        }
    })
    let followed = await Follow.findAll({
        where: {
            follower: user.id
        }
    })


    if(user instanceof User){
        return res.send({
            user,
            followedLen: followed.length,
            followerLen: follower.length,
            msg: authStatus.success
        })
    }

    res.send({msg: user})
}

async function searchUsers(req, res){
    if(req.params.username === undefined || req.query.q === undefined){
        return res.send(requestStatus.badContent)
    }

    const me = await User.findOne({
        attributes: ['id'],
        where:{ username: req.params.username }
    })
    const users = await User.findAll({
        limit: 50,
        attributes: ['id', 'username', 'profilePicture'],
        where: {
            username: {
                [Op.like]: `%${req.query.q}%`,
                [Op.notLike]: req.params.username
            }
        },
        include: [
            {model: Status},
        ]
    })
    const follows = await Follow.findAll({
        attributes: ['followed'],
        where: {
            followed: users.map(u => u.id),
            follower: me.id
        }
    })

    res.send({
        users,
        follows: follows.map(u => u.followed),
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
        attributes: ['id', 'username', 'profilePicture' ],
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
    getUserInfos,
    searchUsers,
    findUserFollows
}
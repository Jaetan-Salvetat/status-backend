const requestStatus = require('../misc/requestStatus')
const { validateToken } = require('../misc/user')
const crud = require('../crud/follows')
const {User, Follow} = require("../sequelize")
const {Op} = require("sequelize");
const findUser = require('../crud/users').read

async function follow(req, res){
    if(req.body.username === undefined || req.body.token === undefined || req.body.followedUsername === undefined){
        return res.send({ msg: requestStatus.badContent })
    }

    if(!validateToken(req.body.token, req.body.username)){
        return res.send({ msg: requestStatus.badToken })
    }

    const followed = await findUser(null, req.body.followedUsername)
    const follower = await findUser(null, req.body.username)
    let follow = requestStatus.error

    if(followed instanceof User && follower instanceof User){
        follow = await crud.create(followed.id, follower.id)
    }

    res.send({ msg: follow })
}

async function unfollow(req, res){
    if(req.body.username === undefined || req.body.token === undefined
        || req.body.followed === undefined){
        return res.send({ msg: requestStatus.badContent })
    }

    if(!validateToken(req.body.token, req.body.username)){
        return res.send({ msg: requestStatus.badToken })
    }

    const me = await User.findOne({
        attributes: ['id'],
        where:{ username: req.body.username }
    })

    await Follow.destroy({
        where: {
            [Op.and]: {
                follower: me.id,
                followed: req.body.followed
            }
        }
    })

    res.send({ msg: requestStatus.success })
}

module.exports = {
    follow,
    unfollow
}
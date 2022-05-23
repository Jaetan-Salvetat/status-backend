const requestStatus = require('../misc/requestStatus')
const { validateToken } = require('../misc/user')
const crud = require('../crud/follows')
const {User} = require("../sequelize")
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

    if(followed instanceof User && follower instanceof User){
        const hasCreated = await crud.create(followed.id, follower.id)

        if(hasCreated === requestStatus.success){
            return res.send({ msg: requestStatus.success })
        }
    }

    res.send({ msg: requestStatus.badUser })
}

async function unfollow(req, res){

}

module.exports = {
    follow,
    unfollow
}
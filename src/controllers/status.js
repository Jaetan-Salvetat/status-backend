const requestStatus = require("../misc/requestStatus");
const {validateToken} = require("../misc/user");
const {User, Status} = require("../sequelize");

async function updateStatus(req, res) {
    if(req.body.username === undefined || req.body.token === undefined
        || req.body.statusName === undefined|| req.body.statusType === undefined){
        return res.send({msg: authStatus.badContent})
    }

    if(req.body.statusType !== 'online' && req.body.statusType !== 'offline'
        && req.body.statusType !== 'away'){
        return res.send({msg: requestStatus.badStatus})
    }

    if(!validateToken(req.body.token, req.body.username)){
        return res.send({msg: requestStatus.badToken})
    }

    let user = await User.findOne({
        where: {
            username: req.body.username
        },
        attributes: ['id'],
    })

    if(!(user instanceof User)){
        return res.send({msg: requestStatus.badUser})
    }

    await Status.update(
        {
            name: req.body.statusName,
            type: req.body.statusType
        },
        {
            where: {
                userId: user.id
            }
        }
    )

    res.send({msg: requestStatus.success})
}


module.exports = {
    updateStatus
}
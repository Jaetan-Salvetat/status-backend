const crud = require('../crud/users')
const requestStatus = require('../misc/requestStatus')

async function searchUsers(req, res){
    if(req.params.username === undefined || req.params.username === null){
        return res.send(requestStatus.badContent)
    }

    res.send({
        users: await crud.findMany(req.params.username),
        msg: requestStatus.success
    })
}

module.exports = {
    searchUsers
}
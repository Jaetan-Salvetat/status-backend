const crud = require('../crud/users')
const requestStatus = require('../misc/requestStatus')

async function searchUsers(req, res){
    if(req.params.username === undefined || req.params.username === null){
        return res.send(requestStatus.badContent)
    }

    res.send(await crud.findMany(req.params.username))
}

module.exports = {
    searchUsers
}
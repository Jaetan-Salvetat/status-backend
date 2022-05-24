const { Socket } = require('socket.io')
const {io} = require("../../server");
const requestStatus = require("../misc/requestStatus");
const {read: findUser} = require("../crud/users");
const {User} = require("../sequelize");
const {update: updateStatus} = require("../crud/status");
const {validateToken} = require("../misc/user");
const {read: getFollows} = require("../crud/follows");

/**
 *
 * @param socket {Socket}
 * @return {Promise<void>}
 */
async function connection(socket){
    const username = socket.handshake.query.username
    const token = socket.handshake.query.token

    //user is connected
    if(!validateToken(token, username)){
        socket.disconnect(true)
        console.log("bad token")
    }

    const user = await findUser(null, username)

    //add user to all follows channel
    if(user instanceof User){
        const follows = await getFollows(null, user.id)
        for(let f of follows){
            socket.join((await findUser(f.followed, null)).username)
        }
        socket.join(username)
    }else{//user is not valid
        socket.disconnect(true)
        console.log("bad user: " + username)
    }
}

/**
 *
 * @param socket {Socket}
 * @param body {any}
 * @return {Promise<void>}
 */
async function editStatus(socket, body){
    if(body.username === undefined || body.type === undefined || body.name === undefined){
        io.to(socket.id)
            .emit('edit-status', {
                'msg': requestStatus.badContent
            })
        return
    }

    const user = await findUser(null, body.username)

    if(user instanceof User){
        const hasUpdated = await updateStatus(user.id, {
            name: body.name,
            type: body.type
        })

        if(hasUpdated === requestStatus.success){
            io.to(body.username)
                .emit('edit-status', {
                    'username': body.username,
                    'newStatusName': body.name,
                    'newStatusType': body.type,
                    "msg": requestStatus.success
                })
            return
        }

        io.to(socket.id)
            .emit('edit-status', {
                'msg': requestStatus.error
            })
        return
    }

    io.to(body.username)
        .emit('edit-status', {
            'msg': requestStatus.badUser
        })
}

module.exports = {
    connection,
    editStatus
}
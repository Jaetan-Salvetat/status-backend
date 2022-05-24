const { Socket } = require('socket.io')
const wsController = require('../controllers/ws')

/**
 *
 * @param socket {Socket}
 * @return {Promise<void>}
 */
module.exports = async (socket) => {
    await wsController.connection(socket)

    socket.on('edit-status', async (body) => {
        await wsController.editStatus(socket, body)
    })
}
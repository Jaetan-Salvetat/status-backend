const fs = require('fs')
const updateUser = require('../crud/users').update
const { validateToken } = require('../misc/user')
const uploadStatus = require('../misc/requestStatus').upload


async function profilePicture(req, res) {
    if(req.file === undefined || req.file === null) {
        return res.send(uploadStatus.badContent + ' file')
    }

    if(!validateToken(req.body.token, req.body.username)){
        return res.send(uploadStatus.badContent + ' token')
    }

    fs.mkdir(`${rootDir}/data/profile-pictures`, _ => {
        const name = req.file.originalname.split('.')
        const filename = `${Date.now()}.${name[name.length - 1]}`
        fs.rename(`${global.rootDir}/temp/${req.file.filename}`, `${rootDir}/data/profile-pictures/${filename}`, async err  => {
            if(err){
                return res.send(uploadStatus.error)
            }

            const userr = await updateUser({profilePicture: filename, username: req.body.username})
            res.send(filename)
        })
    })
}


module.exports = {
    profilePicture
} 
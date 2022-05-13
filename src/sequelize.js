const { Sequelize, DataTypes } = require('sequelize')
const { mysql } = require('../data')

const sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, {dialect: 'mysql'})


//Models
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.TEXT,
    },
},
{
    tableName: 'users'
});


//Init
(async () => {
    await User.sync({alter: true})
})()


module.exports = {
    User,
}
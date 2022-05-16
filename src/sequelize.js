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

const Status = sequelize.define('Status', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING,
    },
},
{
    tableName: 'status'
});


//Init
(async () => {
    await User.sync({alter: true})
    await Status.sync({alter: true})

    User.hasOne(Status)
})()


module.exports = {
    User,
    Status
}
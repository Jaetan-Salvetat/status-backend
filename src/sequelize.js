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
        unique: 'username'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'mail'
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('online', 'away', 'offline')
    },
},
{
    tableName: 'status'
});

const Link = sequelize.define('Link', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING,
    },
},
{
    tableName: 'links'
});

const Follow = sequelize.define('Follow', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    notification: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
},
{
    tableName: 'follows'
});

const Tag = sequelize.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    tableName: 'tags'
});


//Init
(async () => {
    Follow.belongsTo(User, { foreignKey: 'follower' })
    Follow.belongsTo(User, { foreignKey: 'followed' })
    Status.belongsTo(User, { foreignKey: 'userId' })
    Link.belongsTo(User, { foreignKey: 'userId' })
    Tag.belongsTo(User, { foreignKey: 'userId' })

    User.belongsTo(Status, {foreignKey: 'statusId'})

    await User.sync({alter: true})
    await Status.sync({alter: true})
    await Link.sync({alter: true})
    await Follow.sync({alter: true})
    await Tag.sync({alter: true})
})()


module.exports = {
    User,
    Status,
    Link,
    Follow,
    Tag
}
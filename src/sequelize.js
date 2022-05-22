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
        unique: 'usrname'
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
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
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
    followed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    follower: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
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
},
{
    tableName: 'tags'
});


//Init
(async () => {
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
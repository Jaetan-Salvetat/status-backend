const { Sequelize, DataTypes } = require('sequelize')
const express = require('express')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'data/database.sqlite'
  })


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
    tag: {
        type: DataTypes.STRING,
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
    sequelize,
    User,
}
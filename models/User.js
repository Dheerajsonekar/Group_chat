const db = require('../config/database');
const {DataTypes } = require('sequelize');

const User = db.define('user', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
       
    },
    password: {
        type:DataTypes.STRING,
        allowNull: false 
    }
})

module.exports = User;
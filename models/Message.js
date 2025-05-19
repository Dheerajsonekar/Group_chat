const db = require('../config/database');
const {DataTypes} = require('sequelize');
const User = require('../models/User');

const Message = db.define('message', {
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
   
})


User.hasMany(Message)
Message.belongsTo(User);

module.exports = Message;



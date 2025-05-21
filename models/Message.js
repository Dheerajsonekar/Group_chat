const db = require('../config/database');
const {DataTypes} = require('sequelize');
const User = require('../models/User');
const Group = require('./Group');

const Message = db.define('message', {
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
   
})


User.hasMany(Message, {foreignKey: 'userId'})
Message.belongsTo(User, {foreignKey: 'userId'});

Message.belongsTo(Group);
Group.hasMany(Message);

module.exports = Message;



const db = require('../config/database');
const {DataTypes} = require('sequelize');


const Message = db.define('message', {
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
   
})



module.exports = Message;



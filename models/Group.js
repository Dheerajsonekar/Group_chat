const {DataTypes} = require('sequelize');
const db = require('../config/database');


const Group = db.define('group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})



module.exports = Group;

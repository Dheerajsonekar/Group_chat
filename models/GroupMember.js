const {DataTypes }= require('sequelize');
const db = require('../config/database');


const GroupMember = db.define('group_member', {
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})




module.exports = GroupMember;

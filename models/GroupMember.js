const {DataTypes }= require('sequelize');
const db = require('../config/database');
const Group = require('./Group');
const User = require('./User');

const GroupMember = db.define('group_member', {
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})


User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

module.exports = GroupMember;

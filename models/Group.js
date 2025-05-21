const {DataTypes} = require('sequelize');
const db = require('../config/database');
const User = require('./User');

const Group = db.define('group', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Group.belongsTo(User, { foreignKey: 'createdBy' });
User.hasMany(Group, { foreignKey: 'createdBy' });

module.exports = Group;

const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Notice = sequelize.define('Notice', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

}, {
    tableName: 'notices',
    timestamps: true,   // Let sequelize manage the creation timestamps
    updatedAt: false, // we care only when it was created
});

module.exports = Notice;
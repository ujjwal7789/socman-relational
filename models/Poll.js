const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Poll = sequelize.define('Poll', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
   },
   
   question: {
        type: DataTypes.TEXT,
        allowNull: false,
   },

   created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
   },

   is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
   },
}, {
    tableName: 'polls',
    timestamps: true,
    updatedAt: false, 
});

module.exports = Poll;
// PollOption

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PollOption = sequelize.define('PollOption', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
   },
   
   poll_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
   },

   option_text: {
        type: DataTypes.STRING,
        allowNull: false,
   }
}, {
    tableName: 'poll_options',
    timestamps: false,
});

module.exports = PollOption;
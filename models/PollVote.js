//PollVote.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PollVote = sequelize.define('PollVote', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
   },
   
   poll_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
   },

   option_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
   },
   
   user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
   },
}, {
    tableName: 'poll_votes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, 
});

module.exports = PollVote;
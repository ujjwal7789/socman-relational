const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ForumComment = sequelize.define('ForumComment', {
   id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
   },
   
   post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
   },

   comment_text: {
        type: DataTypes.TEXT,
        allowNull: false,
   },

   author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
   },

}, {
    tableName: 'forum_comments',
    timestamps: true,
    updatedAt: false,     
});

module.exports = ForumComment;
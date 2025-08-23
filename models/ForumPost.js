const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ForumPost = sequelize.define('ForumPost', {
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

   author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
   },
}, {
    tableName: 'forum_posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, 
})

module.exports = ForumPost;
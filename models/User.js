const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'resident', 'security', 'staff'),
        allowNull: false,
    },
    apartment_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // admin might not have
    },


}, {
    tableName: 'users',
    timestamps: true, // Sequelize will manage createdAt and updatedAt
});

module.exports = User;
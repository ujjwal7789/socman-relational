const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Complaint = sequelize.define('Complaint', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    raised_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'complaints',
    timestamps: true,
    updatedAt: 'updated_at', // Map updatedAt to our schema's updated_at if needed.
});

module.exports = Complaint;
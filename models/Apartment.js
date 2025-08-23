const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const Apartment = sequelize.define('Apartment', {
    id : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    apartment_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    block: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: true, //An apartment may be unassigned initially
    },
}, {
    tableName: 'apartments',
    timestamps: false, // Our schema for this table does not have timestamps
});

module.exports = Apartment;
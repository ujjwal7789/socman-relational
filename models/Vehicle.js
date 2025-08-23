// models/Vehicle.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  vehicle_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicle_type: {
    type: DataTypes.ENUM('two_wheeler', 'four_wheeler'),
    allowNull: false,
  },
  model: DataTypes.STRING,
}, {
  tableName: 'vehicles',
  timestamps: false,
});

module.exports = Vehicle;
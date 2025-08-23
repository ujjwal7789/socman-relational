// models/Alert.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Alert = sequelize.define('Alert', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  raised_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  alert_type: {
    type: DataTypes.ENUM('medical', 'security', 'fire', 'other'),
    defaultValue: 'security',
  },
  status: {
    type: DataTypes.ENUM('active', 'acknowledged', 'resolved'),
    defaultValue: 'active',
  },
  acknowledged_by: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'alerts',
  timestamps: true,
  updatedAt: false,
});

module.exports = Alert;
// models/Visitor.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Visitor = sequelize.define('Visitor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  visitor_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  visitor_phone: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('expected', 'arrived', 'departed', 'denied'),
    defaultValue: 'expected',
  },
  approved_by_resident: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  entry_time: {
    type: DataTypes.DATE,
  },
  exit_time: {
    type: DataTypes.DATE,
  },
  checked_in_by_security: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'visitors',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Visitor;
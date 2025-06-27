const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Rental = sequelize.define('Rental', {
  rentedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  returnedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});

Rental.belongsTo(User, { as: 'user', foreignKey: 'userId' });
User.hasMany(Rental, { as: 'rentals', foreignKey: 'userId' });

module.exports = Rental;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const Rental = require('./Rental');

const RentalItem = sequelize.define('RentalItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

RentalItem.belongsTo(Rental, { as: 'rental', foreignKey: 'rentalId' });
Rental.hasMany(RentalItem, { as: 'items', foreignKey: 'rentalId' });

RentalItem.belongsTo(Product, { as: 'product', foreignKey: 'productId' });
Product.hasMany(RentalItem, { foreignKey: 'productId' });

module.exports = RentalItem;

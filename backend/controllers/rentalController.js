// controllers/rentalController.js
const { Op }    = require('sequelize');
const sequelize = require('../config/db');
const Rental    = require('../models/Rental');
const RentalItem= require('../models/RentalItem');
const Product   = require('../models/Product');
const User      = require('../models/User');

exports.rent = async (req, res, next) => {
  const { items } = req.body;
  const userId = req.user.id;

  try {
    const created = await sequelize.transaction(async (t) => {
      const rentals = [];

      for (const { productId, quantity } of items) {
        const product = await Product.findByPk(productId, { transaction: t });
        if (!product || product.stock < quantity) {
          throw Object.assign(
              new Error(`Brak produktu lub za mało sztuk: ${productId}`),
              { status: 400 }
          );
        }

        for (let i = 0; i < quantity; i++) {
          const rental = await Rental.create({ userId }, { transaction: t });
          await RentalItem.create({
            rentalId:  rental.id,
            productId,
            quantity: 1,
            productName: product.name
          }, { transaction: t });
          rentals.push(rental);
        }

        await product.update(
            { stock: product.stock - quantity },
            { transaction: t }
        );
      }

      return rentals;
    });

    res.status(201).json({ message: 'Wypożyczono', rentals: created.map(r => r.id), rentalId: created[0].id });
  } catch (err) {
    next(err);
  }
};

exports.getUserRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.findAll({
      where: { userId: req.user.id, returnedAt: null },
      include: [
        {
          model: RentalItem,
          as: 'items',
          where: { quantity: { [Op.gt]: 0 } },
          include: [{ model: Product, as: 'product' }]
        }
      ],
      order: [['rentedAt', 'DESC']]
    });
    res.json(rentals);
  } catch (err) {
    next(err);
  }
};

exports.getRentalHistory = async (req, res, next) => {
  try {
    const rentals = await Rental.findAll({
      include: [
        {
          model: RentalItem,
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id','email','name']
        }
      ],
      order: [['rentedAt', 'DESC']]
    });
    res.json(rentals);
  } catch (err) {
    next(err);
  }
};

exports.returnItem = async (req, res, next) => {
  const { rentalId } = req.params;

  try {
    await sequelize.transaction(async (t) => {
      const rentalItem = await RentalItem.findOne({
        where: { rentalId },
        transaction: t
      });
      if (!rentalItem) {
        throw Object.assign(new Error('No such item in rental'), { status: 404 });
      }
      await rentalItem.update({ quantity: 0 }, { transaction: t });

      const product = await Product.findByPk(rentalItem.productId, { transaction: t });
      await product.update(
          { stock: product.stock + 1 },
          { transaction: t }
      );

      const remaining = await RentalItem.count({
        where: { rentalId },
        transaction: t
      });
      if (rentalItem.quantity === 0) {
        await Rental.update(
            { returnedAt: new Date() },
            { where: { id: rentalId }, transaction: t }
        );
      }
    });

    res.json({ message: 'Return processed', rentalId });
  } catch (err) {
    next(err);
  }
};

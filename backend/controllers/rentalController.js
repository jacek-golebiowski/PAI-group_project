const Rental = require('../models/Rental');
const RentalItem = require('../models/RentalItem');
const Product = require('../models/Product');
const User = require('../models/User');

exports.rent = async (req, res, next) => {
  try {
    console.log('User from token:', req.user);
    const userExists = await User.findByPk(req.user.id);
    console.log('User in DB:', userExists);
    const product = await Product.findByPk(1);
    console.log('Product with ID=1:', product);

    const { items } = req.body;
    const userId = req.user.id;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Brak produktu lub za mało sztuk: ${item.productId}` });
      }
    }

    const rental = await Rental.create({ userId });

    for (const item of items) {
      await RentalItem.create({
        rentalId: rental.id,
        productId: item.productId,
        quantity: item.quantity,
      });

      const product = await Product.findByPk(item.productId);
      await product.update({ stock: product.stock - item.quantity });
    }

    res.status(201).json({ message: 'Wypożyczono', rentalId: rental.id });
  } catch (err) {
    next(err);
  }
};

exports.getUserRentals = async (req, res, next) => {
  try {
    const rentals = await Rental.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: RentalItem,
          as: 'items',
          include: [
            { model: Product, as: 'product' }
          ]
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
          include: [
            { model: Product, as: 'product' }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'name']
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
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ error: 'productId and quantity are required' });
  }

  try {
    const item = await RentalItem.findOne({
      where: {
        rentalId,
        productId
      }
    });
    if (!item) {
      return res.status(404).json({ error: 'No such item in rental' });
    }
    if (quantity > item.quantity) {
      return res.status(400).json({ error: 'Return quantity exceeds rented quantity' });
    }

    const newQty = item.quantity - quantity;
    await item.update({ quantity: newQty });

    const product = await Product.findByPk(productId);
    await product.update({ stock: product.stock + quantity });

    if (newQty === 0) {
      await item.destroy();
    }

    const remaining = await RentalItem.count({ where: { rentalId } });
    if (remaining === 0) {
      await Rental.update(
        { returnedAt: new Date() },
        { where: { id: rentalId } }
      );
    }

    res.json({ message: 'Return processed', rentalId, productId, returned: quantity });
  } catch (err) {
    next(err);
  }
};

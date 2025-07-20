const Rental = require('../models/Rental');
const RentalItem = require('../models/RentalItem');
const User = require('../models/User');
const Product = require('../models/Product');


// GET /api/admin/rentals
exports.getAllRentals = async (req, res, next) => {
    try {
        const rentals = await Rental.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id','email','name'] },
                { model: RentalItem, as: 'items', include: [{ model: Product, as: 'product' }] }
            ],
            order: [['rentedAt', 'DESC']]
        });
        res.json(rentals);
    } catch (err) { next(err); }
};

const productCtrl = require('./productController');
exports.createProduct  = productCtrl.create;
exports.updateProduct  = productCtrl.update;
exports.deleteProduct  = productCtrl.remove;
exports.listProducts   = productCtrl.getAll;

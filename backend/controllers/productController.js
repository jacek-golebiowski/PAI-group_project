const Product  = require('../models/Product');
const Category = require('../models/Category');

exports.getAll = async (req, res, next) => {
    try {
        const prods = await Product.findAll({
            include: [{ model: Category, as: 'category', attributes: ['id','name'] }]
        });
        res.json(prods);
    } catch (err) {
        next(err);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const prod = await Product.findByPk(req.params.id, {
            include: [{ model: Category, as: 'category', attributes: ['id','name'] }]
        });
        if (!prod) return res.status(404).json({ error: 'Nie znaleziono produktu' });
        res.json(prod);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { name, description, price, stock, categoryId } = req.body;
        const cat = await Category.findByPk(categoryId);
        if (!cat) return res.status(404).json({ error: 'Brak kategorii' });

        const prod = await Product.create({ name, description, price, stock, categoryId });
        res.status(201).json(prod);
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const prod = await Product.findByPk(req.params.id);
        if (!prod) return res.status(404).json({ error: 'Nie znaleziono produktu' });
        const { name, description, price, stock, categoryId } = req.body;
        if (categoryId) {
            const cat = await Category.findByPk(categoryId);
            if (!cat) return res.status(404).json({ error: 'Brak kategorii' });
        }
        await prod.update({ name, description, price, stock, categoryId });
        res.json(prod);
    } catch (err) {
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const prod = await Product.findByPk(req.params.id);
        if (!prod) return res.status(404).json({ error: 'Nie znaleziono produktu' });
        await prod.destroy();
        res.json({ message: 'Produkt usunięty' });
    } catch (err) {
        next(err);
    }
};

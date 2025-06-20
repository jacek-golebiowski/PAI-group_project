const Category = require('../models/Category');

exports.getAll = async (req, res, next) => {
    try {
        const cats = await Category.findAll();
        res.json(cats);
    } catch (err) {
        next(err);
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) return res.status(404).json({ error: 'Kategoria nie znaleziona' });
        res.json(cat);
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const cat = await Category.create({ name, description });
        res.status(201).json(cat);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Taka kategoria już istnieje' });
        }
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) return res.status(404).json({ error: 'Kategoria nie znaleziona' });
        const { name, description } = req.body;
        await cat.update({ name, description });
        res.json(cat);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Taka kategoria już istnieje' });
        }
        next(err);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const cat = await Category.findByPk(req.params.id);
        if (!cat) return res.status(404).json({ error: 'Kategoria nie znaleziona' });
        await cat.destroy();
        res.json({ message: 'Kategoria usunięta' });
    } catch (err) {
        next(err);
    }
};

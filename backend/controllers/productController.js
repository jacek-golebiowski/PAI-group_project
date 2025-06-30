const Product  = require('../models/Product');
const Category = require('../models/Category');

const getFullimageName = (req, imageName) => {
  if (!imageName) return null;
  return `${req.protocol}://${req.get('host')}/images/${imageName}`;
};

exports.getAll = async (req, res, next) => {
  try {
    const prods = await Product.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id','name'] }]
    });

    const productsWithFullUrl = prods.map(prod => {
      const productJson = prod.toJSON();
      productJson.imageName = getFullimageName(req, productJson.imageName);
      return productJson;
    });

    res.json(productsWithFullUrl);
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

        const prodJSON = prod.toJSON();
        prodJSON.imageName = prodJSON.imageName ? `/images/${prodJSON.imageName}` : null;

        console.log('Product returned:', prodJSON);

        res.json(prodJSON);
    } catch (err) {
        next(err);
    }
};



exports.create = async (req, res, next) => {
  try {
    const { name, description, price, stock, categoryId, imageName } = req.body;
    const cat = await Category.findByPk(categoryId);
    if (!cat) return res.status(404).json({ error: 'Brak kategorii' });

    const prod = await Product.create({ name, description, price, stock, categoryId, imageName });
    res.status(201).json(prod);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const prod = await Product.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Nie znaleziono produktu' });

    const { name, description, price, stock, categoryId, imageName } = req.body;
    if (categoryId) {
      const cat = await Category.findByPk(categoryId);
      if (!cat) return res.status(404).json({ error: 'Brak kategorii' });
    }

    await prod.update({ name, description, price, stock, categoryId, imageName });
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

const path = require('path');
require('dotenv').config();
const cors = require('cors');

const express   = require('express');
const logger    = require('morgan');
const sequelize = require('./config/db');

require('./models/User');
require('./models/Category');
require('./models/Product');

sequelize.sync({ alter: true })
    .then(() => console.log('✔ DB synced'))
    .catch(e => console.error('✖ DB sync error:', e));

const indexRouter      = require('./routes/index');
const usersRouter      = require('./routes/users');
const authRouter       = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const productsRouter   = require('./routes/products');
const rentalRouter     = require('./routes/rentals');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/rentals', rentalRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Server Error'
    });
});

module.exports = app;

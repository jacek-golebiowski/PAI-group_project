require('dotenv').config();

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

const app = express();

app.use(logger('dev'));
app.use(express.json());


app.use('/',      indexRouter);
app.use('/users', usersRouter);
app.use('/auth',  authRouter);
app.use('/categories', categoriesRouter);
app.use('/products',   productsRouter);


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

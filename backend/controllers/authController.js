const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hash, name });
        res.status(201).json({ message: 'Zarejestrowano', user });
    } catch (err) {
        res.status(400).json({ error: 'Rejestracja nie powiodła się', details: err.message });
    }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Niepoprawne dane' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Niepoprawne dane' });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Zalogowano',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Błąd logowania', details: err.message });
  }
};


const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Brak tokenu' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Nieprawidłowy token' });
  }
};

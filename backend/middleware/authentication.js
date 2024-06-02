const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
function verifyJWT(req, res, next) {
  const bearerToken = req.headers['authorization'];
  if (!bearerToken) return res.status(401).json({ error: 'Access denied' });
  const token = bearerToken.split(' ')[1]
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { verifyJWT };
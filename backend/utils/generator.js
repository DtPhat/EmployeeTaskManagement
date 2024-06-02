const jwt = require('jsonwebtoken');
const { jwtExpiration, jwtSecret } = require('../config/jwt');

const generateAccessCode = () => {
  return Math.random().toString(36).substring(2, 8);
}

const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 12);
}

const generateJWT = (userId) => {
  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: jwtExpiration,
  });
  return token
}
module.exports = {
  generateAccessCode,
  generateVerificationToken,
  generateJWT
}

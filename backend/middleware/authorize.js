const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const { User } = require('../models');
const authorize = (requiredRoles) => {
  return async (req, res, next) => {
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) {
      return res.status(401).json({ message: 'Access Denied: No token provided' });
    }

    const token = bearerToken.split(' ')[1]

    try {
      const decodedValue = jwt.verify(token, jwtSecret);

      req.userId = decodedValue.userId;

      const currentUserDoc = await User.doc(req.userId).get()

      if (!currentUserDoc.exists) {
        return res.status(404).json('Access Denied: User not found');
      }

      const crrentUserData = currentUserDoc.data()

      if (requiredRoles && !requiredRoles?.includes(crrentUserData.role)) {
        return res.status(403).json({ message: 'Access Denied: Not allowed role' });
      }

      next();
    } catch (err) {
      res.status(400).json({ message: 'Invalid token' });
    }
  };
}


module.exports = {
  authorize
};
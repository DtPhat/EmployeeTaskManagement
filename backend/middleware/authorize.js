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

      const currentUserDoc = await User.doc(decodedValue.userId).get()
      
      if (!currentUserDoc.exists) {
        return res.status(404).json('Access Denied: User not found');
      }
      const currentUserData = currentUserDoc.data()
      
      req.userId = decodedValue.userId;
      req.userRole = currentUserData.role;

      if (requiredRoles && !requiredRoles?.includes(currentUserData.role)) {
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
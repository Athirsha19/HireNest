
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify JWT_SECRET exists
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET is not defined in environment variables');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Check if user is active
      if (req.user.status !== 'active') {
        return res.status(403).json({ 
          message: 'Account is not active. Please contact admin.' 
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      // Provide more specific error messages
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token. Please login again.' 
        });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired. Please login again.' 
        });
      }
      
      return res.status(401).json({ 
        message: 'Authentication failed. Please login again.' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;
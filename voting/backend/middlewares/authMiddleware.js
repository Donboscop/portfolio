const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecuresecretvotingkey123!@#');

      if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
        req.role = 'admin';
      } else if (decoded.role === 'student') {
        req.user = await Student.findById(decoded.id).select('-password');
        req.role = 'student';
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin role required' });
  }
};

const isStudent = (req, res, next) => {
  if (req.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Student role required' });
  }
};

module.exports = { protect, isAdmin, isStudent };

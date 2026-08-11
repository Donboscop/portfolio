const Student = require('../models/Student');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecuresecretvotingkey123!@#',
    { expiresIn: '30d' }
  );
};

// @desc    Auth student & get token
// @route   POST /api/auth/student/login
// @access  Public
const loginStudent = async (req, res) => {
  const { collegeId, password } = req.body;

  if (!collegeId || !password) {
    return res.status(400).json({ message: 'Please provide both ID/Mobile No and password' });
  }

  try {
    const student = await Student.findOne({
      $or: [
        { collegeId: collegeId.trim() },
        { phoneNumber: collegeId.trim() }
      ]
    });

    if (student && (await bcrypt.compare(password, student.password))) {
      res.json({
        _id: student._id,
        collegeId: student.collegeId,
        name: student.name,
        phoneNumber: student.phoneNumber,
        hasVoted: student.hasVoted,
        role: 'student',
        token: generateToken(student._id, 'student')
      });
    } else {
      res.status(401).json({ message: 'Invalid ID/Mobile No or Password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        role: 'admin',
        token: generateToken(admin._id, 'admin')
      });
    } else {
      res.status(401).json({ message: 'Invalid Admin Email or Password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      role: req.role,
      ...(req.role === 'admin' ? { email: req.user.email } : {
        collegeId: req.user.collegeId,
        name: req.user.name,
        phoneNumber: req.user.phoneNumber,
        hasVoted: req.user.hasVoted
      })
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = {
  loginStudent,
  loginAdmin,
  getMe
};

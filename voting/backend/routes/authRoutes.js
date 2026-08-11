const express = require('express');
const router = express.Router();
const { loginStudent, loginAdmin, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/student/login', loginStudent);
router.post('/admin/login', loginAdmin);
router.get('/me', protect, getMe);

module.exports = router;

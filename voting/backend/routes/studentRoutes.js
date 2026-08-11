const express = require('express');
const router = express.Router();
const { 
  uploadStudents, 
  getAllStudents, 
  deleteStudent,
  createStudent,
  updateStudent 
} = require('../controllers/studentController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { uploadExcel } = require('../middlewares/uploadMiddleware');

router.post('/upload', protect, isAdmin, uploadExcel.single('file'), uploadStudents);
router.get('/', protect, isAdmin, getAllStudents);
router.post('/', protect, isAdmin, createStudent);
router.put('/:id', protect, isAdmin, updateStudent);
router.delete('/:id', protect, isAdmin, deleteStudent);

module.exports = router;

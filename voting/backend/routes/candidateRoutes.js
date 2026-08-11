const express = require('express');
const router = express.Router();
const {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
} = require('../controllers/candidateController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const { uploadImage } = require('../middlewares/uploadMiddleware');

const uploadFields = uploadImage.fields([
  { name: 'image', maxCount: 1 },
  { name: 'symbolImage', maxCount: 1 }
]);

router.get('/', protect, getCandidates);
router.get('/:id', protect, getCandidateById);
router.post('/', protect, isAdmin, uploadFields, createCandidate);
router.put('/:id', protect, isAdmin, uploadFields, updateCandidate);
router.delete('/:id', protect, isAdmin, deleteCandidate);

module.exports = router;

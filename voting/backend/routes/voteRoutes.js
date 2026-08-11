const express = require('express');
const router = express.Router();
const { castVote } = require('../controllers/voteController');
const { protect, isStudent } = require('../middlewares/authMiddleware');

router.post('/', protect, isStudent, castVote);

module.exports = router;

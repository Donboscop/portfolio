const express = require('express');
const router = express.Router();
const {
  getElectionState,
  startElection,
  stopElection,
  getElectionStats,
  getElectionResults
} = require('../controllers/electionController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

router.get('/', getElectionState);
router.post('/start', protect, isAdmin, startElection);
router.post('/stop', protect, isAdmin, stopElection);
router.get('/stats', protect, isAdmin, getElectionStats);
router.get('/results', protect, getElectionResults);

module.exports = router;

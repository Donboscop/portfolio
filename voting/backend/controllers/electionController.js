const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Student = require('../models/Student');
const Vote = require('../models/Vote');

// @desc    Get current election status
// @route   GET /api/election
// @access  Public
const getElectionState = async (req, res) => {
  try {
    let election = await Election.findOne({});
    if (!election) {
      // Create default pending election if none exists
      election = new Election({
        title: 'College Student Council Election',
        status: 'pending'
      });
      await election.save();
    }
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Start the election
// @route   POST /api/election/start
// @access  Private/Admin
const startElection = async (req, res) => {
  try {
    let election = await Election.findOne({});
    if (!election) {
      election = new Election({ title: 'College Student Council Election' });
    }

    election.status = 'active';
    election.startDate = new Date();
    election.endDate = null;
    await election.save();

    // Reset previous election data: clear votes, reset candidate vote counts, reset student voting status
    await Vote.deleteMany({});
    await Candidate.updateMany({}, { $set: { voteCount: 0 } });
    await Student.updateMany({}, { $set: { hasVoted: false } });

    res.json({ message: 'Election started successfully and all statistics reset.', election });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stop the election
// @route   POST /api/election/stop
// @access  Private/Admin
const stopElection = async (req, res) => {
  try {
    const election = await Election.findOne({});
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    election.status = 'ended';
    election.endDate = new Date();
    await election.save();

    res.json({ message: 'Election stopped successfully.', election });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get full election stats for Admin Dashboard
// @route   GET /api/election/stats
// @access  Private/Admin
const getElectionStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({});
    const studentsVoted = await Student.countDocuments({ hasVoted: true });
    const studentsNotVoted = await Student.countDocuments({ hasVoted: false });
    const totalVotes = await Vote.countDocuments({});

    const votingPercentage = totalStudents > 0 ? ((studentsVoted / totalStudents) * 100).toFixed(2) : 0;

    const candidates = await Candidate.find({}).sort({ voteCount: -1 });

    // Determine Winner
    let winner = null;
    if (candidates.length > 0 && totalVotes > 0) {
      // Check if there is a clear single winner or a tie
      const maxVotes = candidates[0].voteCount;
      if (maxVotes > 0) {
        const potentialWinners = candidates.filter(c => c.voteCount === maxVotes);
        if (potentialWinners.length === 1) {
          winner = potentialWinners[0];
        } else {
          // Tie between multiple candidates
          winner = { name: 'Tie (Multiple Candidates)', voteCount: maxVotes, isTie: true, candidates: potentialWinners };
        }
      }
    }

    res.json({
      totalStudents,
      studentsVoted,
      studentsNotVoted,
      totalVotes,
      votingPercentage,
      candidates,
      winner
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get election results for Students (Only after election ends)
// @route   GET /api/election/results
// @access  Private (Student & Admin)
const getElectionResults = async (req, res) => {
  try {
    const election = await Election.findOne({});
    
    // Safety check: only reveal results if election is ended OR requester is Admin
    const isAdminUser = req.role === 'admin';
    if ((!election || election.status !== 'ended') && !isAdminUser) {
      return res.status(403).json({ 
        message: 'Election results are not available yet. Results will be published after the election ends.',
        status: election ? election.status : 'pending'
      });
    }

    const totalVotes = await Vote.countDocuments({});
    const candidates = await Candidate.find({}).sort({ voteCount: -1 });

    let winner = null;
    if (candidates.length > 0 && totalVotes > 0) {
      const maxVotes = candidates[0].voteCount;
      if (maxVotes > 0) {
        const potentialWinners = candidates.filter(c => c.voteCount === maxVotes);
        if (potentialWinners.length === 1) {
          winner = potentialWinners[0];
        } else {
          winner = { name: 'Tie', voteCount: maxVotes, isTie: true, candidates: potentialWinners };
        }
      }
    }

    res.json({
      title: election ? election.title : 'College Election',
      status: election ? election.status : 'ended',
      endDate: election ? election.endDate : null,
      totalVotes,
      candidates,
      winner
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getElectionState,
  startElection,
  stopElection,
  getElectionStats,
  getElectionResults
};

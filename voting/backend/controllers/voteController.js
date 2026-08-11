const Student = require('../models/Student');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const Election = require('../models/Election');

// @desc    Cast a vote for a candidate
// @route   POST /api/votes
// @access  Private (Student only)
const castVote = async (req, res) => {
  const { candidateId } = req.body;

  if (!candidateId) {
    return res.status(400).json({ message: 'Candidate ID is required' });
  }

  try {
    // 1. Verify election is active
    const election = await Election.findOne({});
    if (!election || election.status !== 'active') {
      return res.status(400).json({ message: 'Voting is not active. The election is either pending or ended.' });
    }

    // 2. Check if user is a student and hasn't voted
    if (req.role !== 'student') {
      return res.status(403).json({ message: 'Only students can cast votes.' });
    }

    const student = await Student.findById(req.user._id);
    if (!student) {
      return res.status(404).json({ message: 'Student record not found.' });
    }

    if (student.hasVoted) {
      return res.status(400).json({ message: 'You have already cast your vote.' });
    }

    // 3. Verify candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found.' });
    }

    // 4. Save Vote record (secret ballot log)
    const newVote = new Vote({
      studentId: student._id,
      candidateId: candidate._id
    });
    await newVote.save();

    // 5. Update Candidate's voteCount
    candidate.voteCount += 1;
    await candidate.save();

    // 6. Update Student's hasVoted flag
    student.hasVoted = true;
    await student.save();

    res.status(201).json({
      message: 'Vote cast successfully. Thank you for voting!',
      student: {
        _id: student._id,
        collegeId: student.collegeId,
        name: student.name,
        hasVoted: student.hasVoted
      }
    });

  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  castVote
};

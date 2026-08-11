const Candidate = require('../models/Candidate');
const { uploadImage } = require('../utils/imageUploader');
const fs = require('fs');

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private (Student & Admin)
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({}).sort({ name: 1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private (Student & Admin)
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (candidate) {
      res.json(candidate);
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a candidate
// @route   POST /api/candidates
// @access  Private/Admin
const createCandidate = async (req, res) => {
  try {
    const { name, department, year, symbol } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Candidate name is required' });
    }

    // Check if candidate photo is provided
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: 'Candidate image photo is required' });
    }

    // Upload candidate image
    const imageFile = req.files.image[0];
    const imageUrl = await uploadImage(imageFile);

    // Upload candidate symbol image if uploaded as file, otherwise use the text/emoji symbol field
    let symbolUrl = symbol || '🌷';
    if (req.files.symbolImage) {
      const symbolFile = req.files.symbolImage[0];
      symbolUrl = await uploadImage(symbolFile);
    }

    const candidate = new Candidate({
      name,
      department: department || '',
      year: year || '',
      image: imageUrl,
      symbol: symbolUrl,
      voteCount: 0
    });

    const createdCandidate = await candidate.save();
    res.status(201).json(createdCandidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a candidate
// @route   PUT /api/candidates/:id
// @access  Private/Admin
const updateCandidate = async (req, res) => {
  try {
    const { name, department, year, symbol } = req.body;
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.name = name || candidate.name;
    candidate.department = department !== undefined ? department : candidate.department;
    candidate.year = year !== undefined ? year : candidate.year;

    // Check if new candidate photo is uploaded
    if (req.files && req.files.image) {
      const imageFile = req.files.image[0];
      candidate.image = await uploadImage(imageFile);
    }

    // Check if new symbol file is uploaded, otherwise update text/emoji symbol if provided
    if (req.files && req.files.symbolImage) {
      const symbolFile = req.files.symbolImage[0];
      candidate.symbol = await uploadImage(symbolFile);
    } else if (symbol) {
      candidate.symbol = symbol;
    }

    const updatedCandidate = await candidate.save();
    res.json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a candidate
// @route   DELETE /api/candidates/:id
// @access  Private/Admin
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (candidate) {
      await Candidate.deleteOne({ _id: candidate._id });
      res.json({ message: 'Candidate removed successfully' });
    } else {
      res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate
};

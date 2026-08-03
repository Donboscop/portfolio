import express from 'express';
import Milestone from '../models/Milestone.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all milestones
// @route   GET /api/milestones
// @access  Public
router.get('/', async (req, res) => {
  try {
    const milestones = await Milestone.find();
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new milestone
// @route   POST /api/milestones
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { year, title, company, description } = req.body;

  if (!year || !title || !company || !description) {
    return res.status(400).json({ message: 'Year, title, company, and description are required' });
  }

  try {
    const newMilestone = new Milestone({
      year,
      title,
      company,
      description
    });

    const savedMilestone = await newMilestone.save();
    res.status(201).json(savedMilestone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a milestone
// @route   PUT /api/milestones/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { year, title, company, description } = req.body;

  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    if (year !== undefined) milestone.year = year;
    if (title !== undefined) milestone.title = title;
    if (company !== undefined) milestone.company = company;
    if (description !== undefined) milestone.description = description;

    const updatedMilestone = await milestone.save();
    res.json(updatedMilestone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a milestone
// @route   DELETE /api/milestones/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    await Milestone.findByIdAndDelete(req.params.id);
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

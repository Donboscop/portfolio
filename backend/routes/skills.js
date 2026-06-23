import express from 'express';
import Skill from '../models/Skill.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { name, level, category } = req.body;

  if (!name || level === undefined || !category) {
    return res.status(400).json({ message: 'Name, level, and category are required' });
  }

  try {
    const newSkill = new Skill({
      name,
      level,
      category
    });

    const savedSkill = await newSkill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { name, level, category } = req.body;

  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (name !== undefined) skill.name = name;
    if (level !== undefined) skill.level = level;
    if (category !== undefined) skill.category = category;

    const updatedSkill = await skill.save();
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

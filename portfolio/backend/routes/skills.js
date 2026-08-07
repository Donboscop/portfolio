import express from 'express';
import { query } from '../config/db.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const mapSkill = (row) => row ? { ...row, _id: row.id } : null;

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM skills ORDER BY id ASC');
    res.json(result.rows.map(mapSkill));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { name, level, category, icon } = req.body;

  if (!name || level === undefined || !category) {
    return res.status(400).json({ message: 'Name, level, and category are required' });
  }

  try {
    const result = await query(
      'INSERT INTO skills (name, level, category, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, parseInt(level, 10), category, icon || 'code']
    );
    res.status(201).json(mapSkill(result.rows[0]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { name, level, category, icon } = req.body;
  const skillId = parseInt(req.params.id, 10);

  try {
    const existing = await query('SELECT * FROM skills WHERE id = $1', [skillId]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    const current = existing.rows[0];
    const updatedName = name !== undefined ? name : current.name;
    const updatedLevel = level !== undefined ? parseInt(level, 10) : current.level;
    const updatedCat = category !== undefined ? category : current.category;
    const updatedIcon = icon !== undefined ? icon : current.icon;

    const result = await query(
      'UPDATE skills SET name = $1, level = $2, category = $3, icon = $4 WHERE id = $5 RETURNING *',
      [updatedName, updatedLevel, updatedCat, updatedIcon, skillId]
    );

    res.json(mapSkill(result.rows[0]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  const skillId = parseInt(req.params.id, 10);

  try {
    const existing = await query('SELECT * FROM skills WHERE id = $1', [skillId]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    await query('DELETE FROM skills WHERE id = $1', [skillId]);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

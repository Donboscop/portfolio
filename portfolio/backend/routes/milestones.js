import express from 'express';
import { query } from '../config/db.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const mapMilestone = (row) => row ? { ...row, _id: row.id } : null;

// @desc    Get all milestones
// @route   GET /api/milestones
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM milestones ORDER BY id ASC');
    res.json(result.rows.map(mapMilestone));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new milestone
// @route   POST /api/milestones
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  const { year, title, company, description, icon } = req.body;

  if (!year || !title || !description) {
    return res.status(400).json({ message: 'Year, title, and description are required' });
  }

  try {
    const result = await query(
      'INSERT INTO milestones (year, title, company, description, icon) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [year, title, company || '', description, icon || 'briefcase']
    );
    res.status(201).json(mapMilestone(result.rows[0]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a milestone
// @route   PUT /api/milestones/:id
// @access  Private/Admin
router.put('/:id', protect, async (req, res) => {
  const { year, title, company, description, icon } = req.body;
  const msId = parseInt(req.params.id, 10);

  try {
    const existing = await query('SELECT * FROM milestones WHERE id = $1', [msId]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const current = existing.rows[0];
    const updatedYear = year !== undefined ? year : current.year;
    const updatedTitle = title !== undefined ? title : current.title;
    const updatedCompany = company !== undefined ? company : current.company;
    const updatedDesc = description !== undefined ? description : current.description;
    const updatedIcon = icon !== undefined ? icon : current.icon;

    const result = await query(
      'UPDATE milestones SET year = $1, title = $2, company = $3, description = $4, icon = $5 WHERE id = $6 RETURNING *',
      [updatedYear, updatedTitle, updatedCompany, updatedDesc, updatedIcon, msId]
    );

    res.json(mapMilestone(result.rows[0]));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a milestone
// @route   DELETE /api/milestones/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  const msId = parseInt(req.params.id, 10);

  try {
    const existing = await query('SELECT * FROM milestones WHERE id = $1', [msId]);

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    await query('DELETE FROM milestones WHERE id = $1', [msId]);
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

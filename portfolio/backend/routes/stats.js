import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// @desc    Get visitor count
// @route   GET /api/stats
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT count FROM stats LIMIT 1');
    if (result.rows.length === 0) {
      const inserted = await query('INSERT INTO stats (label, value, count) VALUES ($1, $2, $3) RETURNING count', ['visitors', '0', 0]);
      return res.json({ count: inserted.rows[0].count });
    }
    res.json({ count: result.rows[0].count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Increment visitor count
// @route   POST /api/stats/increment
// @access  Public
router.post('/increment', async (req, res) => {
  try {
    const result = await query('SELECT id, count FROM stats LIMIT 1');
    let newCount = 1;
    if (result.rows.length === 0) {
      await query('INSERT INTO stats (label, value, count) VALUES ($1, $2, $3)', ['visitors', '1', 1]);
    } else {
      newCount = (result.rows[0].count || 0) + 1;
      await query('UPDATE stats SET count = $1, value = $2 WHERE id = $3', [newCount, newCount.toString(), result.rows[0].id]);
    }
    res.json({ count: newCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../config/db.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Multer Upload Filter
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|gif/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only (jpeg, jpg, png, webp, gif)!'));
    }
  }
});

// Helper to parse comma-separated lists and remove empties
const parseList = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val.split(',').map(item => item.trim()).filter(Boolean);
};

const mapProject = (row) => {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
    githubLink: row.github_link || row.github_url || '',
    liveLink: row.live_link || row.demo_url || '',
    github_url: row.github_url || row.github_link || '',
    demo_url: row.demo_url || row.live_link || '',
    image_url: row.image_url || (row.images && row.images[0]) || '',
    challengesFaced: row.challenges_faced || '',
    learningOutcomes: row.learning_outcomes || '',
    createdAt: row.created_at
  };
};

// @desc    Get all projects (public with search & tech filter)
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, tech } = req.query;
    let sql = 'SELECT * FROM projects WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (title ILIKE $${params.length} OR description ILIKE $${params.length} OR array_to_string(technologies, ',') ILIKE $${params.length})`;
    }

    if (tech) {
      params.push(tech);
      sql += ` AND ($${params.length} = ANY(technologies) OR array_to_string(technologies, ',') ILIKE '%' || $${params.length} || '%')`;
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows.map(mapProject));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const projId = parseInt(req.params.id, 10);
    if (isNaN(projId)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }
    const result = await query('SELECT * FROM projects WHERE id = $1', [projId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(mapProject(result.rows[0]));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      features,
      challengesFaced,
      learningOutcomes,
      existingImages,
      category,
      featured
    } = req.body;

    const parsedTech = parseList(technologies);
    const parsedFeatures = parseList(features);
    
    // Gather files and format relative paths
    const newImageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const parsedExisting = parseList(existingImages);
    const allImages = [...parsedExisting, ...newImageUrls];

    const isFeatured = featured === 'true' || featured === true;
    const cat = category || 'Web';

    const sql = `
      INSERT INTO projects 
      (title, description, technologies, tags, github_url, demo_url, github_link, live_link, images, image_url, featured, category, features, challenges_faced, learning_outcomes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      title,
      description || '',
      parsedTech,
      parsedTech,
      githubLink || '',
      liveLink || '',
      githubLink || '',
      liveLink || '',
      allImages,
      allImages[0] || '',
      isFeatured,
      cat,
      parsedFeatures,
      challengesFaced || '',
      learningOutcomes || ''
    ];

    const result = await query(sql, values);
    res.status(201).json(mapProject(result.rows[0]));
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const projId = parseInt(req.params.id, 10);
    const existing = await query('SELECT * FROM projects WHERE id = $1', [projId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const current = existing.rows[0];
    const {
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      features,
      challengesFaced,
      learningOutcomes,
      existingImages,
      category,
      featured
    } = req.body;

    const newImageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const parsedExisting = parseList(existingImages);
    const allImages = existingImages !== undefined ? [...parsedExisting, ...newImageUrls] : current.images;

    const updatedTitle = title || current.title;
    const updatedDesc = description !== undefined ? description : current.description;
    const updatedTech = technologies !== undefined ? parseList(technologies) : current.technologies;
    const updatedFeatures = features !== undefined ? parseList(features) : current.features;
    const updatedGithub = githubLink !== undefined ? githubLink : current.github_link;
    const updatedLive = liveLink !== undefined ? liveLink : current.live_link;
    const updatedChallenges = challengesFaced !== undefined ? challengesFaced : current.challenges_faced;
    const updatedLearning = learningOutcomes !== undefined ? learningOutcomes : current.learning_outcomes;
    const updatedCat = category !== undefined ? category : current.category;
    const updatedFeatured = featured !== undefined ? (featured === 'true' || featured === true) : current.featured;

    const sql = `
      UPDATE projects 
      SET title = $1, description = $2, technologies = $3, tags = $4, github_url = $5, demo_url = $6, 
          github_link = $7, live_link = $8, images = $9, image_url = $10, featured = $11, category = $12, 
          features = $13, challenges_faced = $14, learning_outcomes = $15
      WHERE id = $16
      RETURNING *
    `;

    const values = [
      updatedTitle,
      updatedDesc,
      updatedTech,
      updatedTech,
      updatedGithub,
      updatedLive,
      updatedGithub,
      updatedLive,
      allImages,
      allImages[0] || '',
      updatedFeatured,
      updatedCat,
      updatedFeatures,
      updatedChallenges,
      updatedLearning,
      projId
    ];

    const result = await query(sql, values);
    res.json(mapProject(result.rows[0]));
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const projId = parseInt(req.params.id, 10);
    const existing = await query('SELECT * FROM projects WHERE id = $1', [projId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const current = existing.rows[0];

    // Clean up uploaded files
    if (Array.isArray(current.images)) {
      current.images.forEach(img => {
        if (typeof img === 'string' && img.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), img.substring(1));
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (err) {
              console.error(`Failed to delete file ${filePath}:`, err.message);
            }
          }
        }
      });
    }

    await query('DELETE FROM projects WHERE id = $1', [projId]);
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

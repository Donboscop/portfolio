import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Project from '../models/Project.js';
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

// @desc    Get all projects (public with search & tech filter)
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, tech } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } }
      ];
    }

    if (tech) {
      query.technologies = { $regex: new RegExp(`^${tech}$`, 'i') };
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.id || req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
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
      existingImages
    } = req.body;

    const parsedTech = parseList(technologies);
    const parsedFeatures = parseList(features);
    
    // Gather files and format relative paths
    const newImageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const parsedExisting = parseList(existingImages);
    const allImages = [...parsedExisting, ...newImageUrls];

    const project = new Project({
      title,
      description,
      technologies: parsedTech,
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      images: allImages,
      features: parsedFeatures,
      challengesFaced: challengesFaced || '',
      learningOutcomes: learningOutcomes || ''
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const {
      title,
      description,
      technologies,
      githubLink,
      liveLink,
      features,
      challengesFaced,
      learningOutcomes,
      existingImages
    } = req.body;

    project.title = title || project.title;
    project.description = description || project.description;
    project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
    project.liveLink = liveLink !== undefined ? liveLink : project.liveLink;
    project.challengesFaced = challengesFaced !== undefined ? challengesFaced : project.challengesFaced;
    project.learningOutcomes = learningOutcomes !== undefined ? learningOutcomes : project.learningOutcomes;

    if (technologies !== undefined) {
      project.technologies = parseList(technologies);
    }
    if (features !== undefined) {
      project.features = parseList(features);
    }

    // Merge existing images with newly uploaded ones
    const newImageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const parsedExisting = parseList(existingImages);
    project.images = [...parsedExisting, ...newImageUrls];

    const updatedProject = await project.save();
    res.json(updatedProject);
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
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Clean up local uploaded files associated with this project
    project.images.forEach(img => {
      if (img.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), img.substring(1));
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error(`Failed to delete local file ${filePath}:`, err.message);
          }
        }
      }
    });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

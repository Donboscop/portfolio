import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Certificate from '../models/Certificate.js';
import protect from '../middleware/auth.js';

const router = express.Router();

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
    cb(null, `certificate-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Multer Upload Filter for PDFs and images
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for certificates
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|gif|pdf/i;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const isPdf = file.mimetype === 'application/pdf';
    const isImg = /image/i.test(file.mimetype);

    if (extname && (isPdf || isImg)) {
      return cb(null, true);
    } else {
      cb(new Error('Images and PDF files only (jpeg, jpg, png, webp, gif, pdf)!'));
    }
  }
});

// @desc    Get all certificates
// @route   GET /api/certifications
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Sort by createdAt: -1 to show most recently added certifications first
    const certificates = await Certificate.find({}).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new certificate
// @route   POST /api/certifications
// @access  Private/Admin
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      issuer,
      date,
      credentialId,
      verifyUrl,
      category,
      description
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Certificate file (PDF or Image) is required' });
    }

    // Check if credential ID already exists
    const existing = await Certificate.findOne({ credentialId });
    if (existing) {
      // If we uploaded a file but the credential ID exists, delete the uploaded file to avoid orphaned files
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'A certificate with this Credential ID already exists' });
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    const certificate = new Certificate({
      title,
      issuer,
      date,
      credentialId,
      verifyUrl: verifyUrl || '',
      pdfUrl,
      category: category || 'practical',
      description: description || ''
    });

    const savedCertificate = await certificate.save();
    res.status(201).json(savedCertificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    // Delete file if saved failed
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to clean up file after DB error:', err.message);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a certificate
// @route   DELETE /api/certifications/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    // Clean up local uploaded file associated with this certificate
    if (certificate.pdfUrl && certificate.pdfUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), certificate.pdfUrl.substring(1));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete certificate file ${filePath}:`, err.message);
        }
      }
    }

    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

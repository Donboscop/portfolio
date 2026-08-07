import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../config/db.js';
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

const mapCertificate = (row) => row ? {
  ...row,
  _id: row.id,
  credentialId: row.credential_id,
  verifyUrl: row.verify_url,
  pdfUrl: row.pdf_url,
  date: row.date || row.issue_date,
  createdAt: row.created_at
} : null;

// @desc    Get all certificates
// @route   GET /api/certifications
// @access  Public
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM certificates ORDER BY created_at DESC');
    res.json(result.rows.map(mapCertificate));
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

    if (credentialId) {
      const existing = await query('SELECT * FROM certificates WHERE credential_id = $1', [credentialId]);
      if (existing.rows.length > 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'A certificate with this Credential ID already exists' });
      }
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    const sql = `
      INSERT INTO certificates (title, issuer, date, issue_date, credential_id, verify_url, pdf_url, category, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await query(sql, [
      title,
      issuer,
      date || '',
      date || '',
      credentialId || '',
      verifyUrl || '',
      pdfUrl,
      category || 'practical',
      description || ''
    ]);

    res.status(201).json(mapCertificate(result.rows[0]));
  } catch (error) {
    console.error('Error creating certificate:', error);
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
    const certId = parseInt(req.params.id, 10);
    const existing = await query('SELECT * FROM certificates WHERE id = $1', [certId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    const cert = existing.rows[0];

    if (cert.pdf_url && cert.pdf_url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), cert.pdf_url.substring(1));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete certificate file ${filePath}:`, err.message);
        }
      }
    }

    await query('DELETE FROM certificates WHERE id = $1', [certId]);
    res.json({ message: 'Certificate removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

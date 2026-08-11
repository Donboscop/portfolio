const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.log('Cloudinary credentials missing in .env. Falling back to local storage.');
}

/**
 * Uploads a file (from multer local temp or storage) to Cloudinary or keeps it locally
 * @param {Object} file - The file object from Multer
 * @returns {Promise<string>} The public URL of the uploaded image
 */
const uploadImage = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'voting-system',
        use_filename: true,
      });
      // Delete temporary local file created by multer
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload failed, using local path as fallback:', error);
      // Fallback to local url if upload fails
    }
  }

  // Local storage fallback: move file from temp to public/uploads
  const publicDir = path.join(__dirname, '..', 'public');
  const uploadsDir = path.join(publicDir, 'uploads');

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const targetPath = path.join(uploadsDir, file.filename);

  // If the file is not already in public/uploads, move it there
  if (file.path !== targetPath && fs.existsSync(file.path)) {
    fs.renameSync(file.path, targetPath);
  }

  // Return local URL path
  return `/uploads/${file.filename}`;
};

module.exports = { uploadImage, isCloudinaryConfigured };

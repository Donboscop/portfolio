import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @desc    Generate & send OTP to admin email
// @route   POST /api/auth/otp/send
// @access  Public
router.post('/otp/send', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Administrator not found with this email' });
    }

    // Generate random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP expiration to 5 minutes from now
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Save to user model
    user.otp = generatedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    // Print to the server terminal console
    console.log('\n======================================================');
    console.log('              [OTP VERIFICATION SERVICE]');
    console.log(`  To:       ${email}`);
    console.log(`  Code:     ${generatedOtp}  (Expires in 5 minutes)`);
    console.log('======================================================\n');

    res.json({ success: true, message: 'Verification code sent to your server console!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify OTP code & return JWT token
// @route   POST /api/auth/otp/verify
// @access  Public
router.post('/otp/verify', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP matches and is not expired
    if (!user.otp || user.otp !== otp || !user.otpExpires || new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Clear OTP after successful verification
    user.otp = '';
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      _id: user._id,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify if token is active
// @route   GET /api/auth/verify
// @access  Protected
router.get('/verify', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    if (user) {
      res.json({ valid: true, user });
    } else {
      res.status(404).json({ valid: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
});

export default router;

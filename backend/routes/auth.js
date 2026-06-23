import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import protect from '../middleware/auth.js';
import { sendEmail } from '../config/mailer.js';

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

    // Send via email service
    const mailResult = await sendEmail({
      to: email,
      subject: 'Your Admin Dashboard OTP Code',
      text: `Your OTP is: ${generatedOtp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #f8fafc; color: #1e293b;">
          <h2 style="color: #2563eb; text-align: center; margin-bottom: 24px;">Secure Verification Code</h2>
          <p style="font-size: 15px; line-height: 1.5;">Hello,</p>
          <p style="font-size: 15px; line-height: 1.5;">A request was made to log into the Admin Dashboard of your Developer Portfolio. Please use the verification code below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 24px; background-color: #eff6ff; border: 1px dashed #3b82f6; border-radius: 8px; color: #1d4ed8; display: inline-block;">${generatedOtp}</span>
          </div>
          <p style="font-size: 13px; line-height: 1.5; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px;">This code is valid for <strong>5 minutes</strong>. If you did not initiate this request, please secure your credentials immediately.</p>
        </div>
      `
    });

    res.json({ 
      success: true, 
      message: mailResult.fallback 
        ? 'Verification code generated! Please check your server console log.' 
        : 'Verification code sent to your email inbox!' 
    });
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

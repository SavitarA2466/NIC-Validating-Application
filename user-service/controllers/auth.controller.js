const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpStore = require('../utils/otpStore');
const emailService = require('../utils/emailService');

// Handle user registration
exports.register = async (req, res) => {
  console.log('Received registration request:', req.body);
  const { username, email, password } = req.body;
  try {
    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user in the database
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Handle user login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token:', token);

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Send OTP to email
exports.sendOtp = (req, res) => {
  const { email } = req.body;

  console.log('Received send OTP request:', email);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.setOtp(email, otp);
  emailService.sendEmail(email, `Your OTP is: ${otp}`);

  res.status(200).json({ message: 'OTP sent successfully' });
};

// Verify OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore.verifyOtp(email, otp)) {
    otpStore.clearOtp(email); // Clear OTP after successful verification
    res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
};

// Change user password
exports.changePassword = (req, res) => {
  const { email, newPassword } = req.body;

  User.update({ password: bcrypt.hashSync(newPassword, 10) }, { where: { email } })
    .then(() => {
      res.status(200).json({ message: 'Password changed successfully' });
    })
    .catch(() => {
      res.status(500).json({ error: 'Failed to change password' });
    });
};
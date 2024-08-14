const express = require('express');
const { sendOtp, verifyOtp, changePassword, register, login } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/change-password', changePassword);

module.exports = router;
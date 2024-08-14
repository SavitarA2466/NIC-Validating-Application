const jwt = require('jsonwebtoken');

// Validate registration request
exports.validateRegister = (req, res, next) => {
  const { username, email, password, retypePassword } = req.body;

  if (!username || !email || !password || !retypePassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

// Middleware to authenticate JWT token
exports.authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }
  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }
    // Attach userId to request object
    req.userId = decoded.userId;
    next();
  });
};
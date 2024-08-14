const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const sequelize = require('./config/db.config');
require('dotenv').config();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('Database connection established and synced.');
    console.log(`User service running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

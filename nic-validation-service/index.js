const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db.config.js');
const nicRoutes = require('./routes/nicValidation.routes.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sync database
db.sequelize.sync().then(() => {
    console.log('Database synchronized');
}).catch((err) => {
    console.error('Failed to synchronize database:', err.message);
});

// Routes
app.use('/api/nic-validation', nicRoutes);

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`NIC Validation Service running on port ${PORT}`);
});

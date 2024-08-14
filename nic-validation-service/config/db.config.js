require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import the models here
db.nic = require('../models/nic.model.js')(sequelize, DataTypes);

module.exports = db;

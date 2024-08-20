const csv = require('csv-parser'); 
const stream = require('stream'); 
const { getNicDetails } = require('../utils/nicUtils.js'); 
const db = require('../config/db.config.js'); 
const { Op } = require('sequelize'); 

const validateNics = async (req, res) => {
  const files = req.files; 
  const results = []; 

  // Ensure exactly 4 files are uploaded
  if (files.length !== 4) {
    return res.status(400).json({ error: 'Please upload 4 files.' });
  }

  try {
    // Process each file
    for (const file of files) {
      const nicNumbers = await parseCsv(file.buffer); 
      const fileName = file.originalname; 
      for (const nic of nicNumbers) {
        const details = getNicDetails(nic); 
        if (details) {
          results.push({ ...details, file_name: fileName }); 
          try {
            await db.nic.create({ nic_number: nic, ...details, file_name: fileName });
          } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
              console.log(`NIC ${nic} already exists in the database. Skipping insertion.`);
            } else {
              throw error; 
            }
          }
        }
      }
    }
    
    res.json({ data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to validate NICs' }); 
  }
};


const parseCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const nicNumbers = []; 
    const readableStream = new stream.Readable(); 
    readableStream.push(buffer); 
    readableStream.push(null); 

    // Pipe the stream through the CSV parser
    readableStream.pipe(csv())
      .on('data', (data) => nicNumbers.push(data.nic)) 
      .on('end', () => resolve(nicNumbers)) 
      .on('error', (error) => reject(error)); 
  });
};

const getNicData = async (req, res) => {
  const { date, gender, file_name } = req.query; 

  const whereConditions = {}; 

  if (gender) {
    whereConditions.gender = gender; // Filter by gender
  }

  if (file_name) {
    whereConditions.file_name = {
      [Op.like]: `%${file_name}%`, // Filter by file name using LIKE operator
    };
  }

  try {
    const nicData = await db.nic.findAll({
      where: whereConditions, 
      order: [['createdAt', 'DESC']], // Sort by creation date in descending order
    });
    res.json(nicData); 
  } catch (err) {
    console.error('Failed to fetch NIC data:', err);
    res.status(500).json({ error: 'Failed to fetch NIC data' }); 
  }
};

const getNicStats = async (req, res) => {
  try {
    const stats = await db.nic.findAll({
      attributes: [
        'gender',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'], 
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'], 
      ],
      where: {
        createdAt: {
          [Op.gte]: db.sequelize.literal("DATE_SUB(CURDATE(), INTERVAL 6 DAY)") 
        }
      },
      group: ['gender', 'date'], 
      order: [['date', 'ASC']], 
    });

    res.json(stats); 
  } catch (err) {
    console.error('Failed to fetch NIC stats:', err);
    res.status(500).json({ error: 'Failed to fetch NIC stats' }); 
  }
};

const getGenderDistribution = async (req, res) => {
  try {
    const distribution = await db.nic.findAll({
      attributes: [
        'gender',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'], 
      ],
      group: ['gender'], 
    });

    res.json(distribution); 
  } catch (err) {
    console.error('Failed to fetch gender distribution:', err);
    res.status(500).json({ error: 'Failed to fetch gender distribution' }); 
  }
};

module.exports = { validateNics, getNicData, getNicStats, getGenderDistribution };


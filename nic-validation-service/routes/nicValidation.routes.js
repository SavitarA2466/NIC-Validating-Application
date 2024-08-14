const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware.js');
const { getNicData } = require('../controllers/nicValidation.controller');
const { validateNics } = require('../controllers/nicValidation.controller.js');
const { getNicStats, getGenderDistribution } = require('../controllers/nicValidation.controller');

router.post('/validate', upload.array('files', 4), validateNics);
router.get('/', getNicData);
router.get('/stats/last7days', getNicStats);
router.get('/stats/gender-distribution', getGenderDistribution);

module.exports = router;

const express = require('express');
const { getStops, getTableData } = require('../controllers/appControllers');

const router = express.Router();

router.get('/stops', getStops);
router.post('/table', getTableData);

module.exports = router;
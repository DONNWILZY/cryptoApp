const express = require('express');
const router = express.Router();
const { withdraw } = require('../controllers/withdrawController');

// Endpoint for handling withdrawals
router.post('/withdraw', withdraw);

module.exports = router;

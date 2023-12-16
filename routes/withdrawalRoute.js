const express = require('express');
const router = express.Router();
const { withdraw, updateWithdrawal } = require('../controllers/withdrawController');

// Endpoint for handling withdrawals
router.post('/withdraw', withdraw);

// Route to update withdrawal status
router.put('/update', updateWithdrawal);

module.exports = router;

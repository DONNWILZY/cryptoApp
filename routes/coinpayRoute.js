const express = require('express');
const router = express.Router();
const coinPayController = require('../controllers/coinPayControllers');

// Routes
router.post('/coinpays', coinPayController.createCoinPay);
router.get('/coinpays', coinPayController.getAllCoinPays);
router.get('/coinpays/:id', coinPayController.getCoinPayById);
router.put('/coinpays/:id', coinPayController.updateCoinPay);
router.delete('/coinpays/:id', coinPayController.deleteCoinPay);

module.exports = router;

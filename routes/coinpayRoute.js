const express = require('express');
const router = express.Router();
const coinPayController = require('../controllers/coinPayControllers');
const {verifyToken, verifyUser, verifyAdmin} = require('../middleWare/userAuthMiddleware');



// Routes
router.post('/coinpays', verifyToken, verifyAdmin, coinPayController.createCoinPay);
router.get('/coinpays', coinPayController.getAllCoinPays);
router.get('/coinpays/:id', coinPayController.getCoinPayById);
router.put('/coinpays/:id', coinPayController.updateCoinPay);
router.delete('/coinpays/:id', coinPayController.deleteCoinPay);

module.exports = router;

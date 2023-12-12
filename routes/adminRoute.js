const express = require('express');
const router = express.Router();
const {verifyToken, verifyAdmin} = require('../middleWare/userAuthMiddleware');


const {addCoinPrice, addCoinS, getAllCoins, getCoinBySymbol,  } = require('../controllers/CointRateController');
const {loginUser, registerUser} = require('../controllers/authController');
const {createCoinPay} = require('../controllers/coinPayControllers');
const {} = require('../controllers/planControllers');
const {} = require('../controllers/proofController');
const {} = require('../controllers/reversalController');
const {} = require('../controllers/sellControllers');
const {} = require('../controllers/swapcontroller');
const {} = require('../controllers/userController');
const {} = require('../controllers/viewDepositForPlanController');









module.exports = router;
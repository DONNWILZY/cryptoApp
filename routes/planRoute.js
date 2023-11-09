const express = require('express');
const router = express.Router();
const { createInvestmentPlan, createPlan, subscribeToPlan } = require('../controllers/planControllers');

// Route to create an investment plan createPlan
router.post('/create', createInvestmentPlan);
router.post('/add', createPlan);
router.post('/subscribe', subscribeToPlan);
//subscribeToPlan

module.exports = router;

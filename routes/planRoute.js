const express = require('express');
const router = express.Router();
const { createInvestmentPlan, createPlan, subscribeToPlan, approveDeposit } = require('../controllers/planControllers');

// Route to create an investment plan createPlan
router.post('/create', createInvestmentPlan);
router.post('/add', createPlan);
router.post('/subscribe', subscribeToPlan);
//subscribeToPlan

// Route to approve a deposit
router.post('/approve/:depositProofId', async (req, res) => {
  try {
    const { depositProofId } = req.params;
    const depositProof = await approveDeposit(depositProofId);

    if (depositProof) {
      res.status(200).json({
        success: true,
        message: 'Deposit proof approved successfully',
        data: depositProof,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Deposit proof not found or already approved',
      });
    }
  } catch (error) {
    console.error('Error approving deposit proof:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});


  

module.exports = router;

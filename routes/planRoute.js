const express = require('express');
const router = express.Router();
const { createInvestmentPlan, createPlan, subscribeToPlan, approveDeposit , updateDeposit } = require('../controllers/planControllers');

// Route to create an investment plan createPlan
router.post('/create', createInvestmentPlan);
router.post('/add', createPlan);
router.post('/subscribe', subscribeToPlan);

//subscribeToPlan


//Route to approve deposit proof
router.post('/approve/:depositProofId', async (req, res) => {
  try {
    const { depositProofId } = req.params;
    const { status, adminNote } = req.body; // Extract status and adminNote from the request body

    const approvedDepositProof = await approveDeposit(depositProofId, status, adminNote);

    if (approvedDepositProof) {
      res.status(200).json({
        success: true,
        message: 'Deposit proof approved successfully',
        data: approvedDepositProof,
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


// Route to update deposit proof
// Route to update deposit proof status and/or admin note
// Route to update deposit proof
router.patch('/status/:depositProofId', async (req, res) => {
  try {
      const { depositProofId } = req.params;
      const updateData = req.body; // Extract update data from the request body

      const updatedDepositProof = await updateDeposit(depositProofId, updateData);

      if (updatedDepositProof) {
          res.status(200).json({
              success: true,
              message: 'Deposit proof updated successfully',
              data: updatedDepositProof,
          });
      } else {
          res.status(404).json({
              success: false,
              message: 'Deposit proof not found or failed to update',
          });
      }
  } catch (error) {
      console.error('Error updating deposit proof:', error);
      res.status(500).json({
          success: false,
          message: 'Internal server error',
      });
  }
});






  

module.exports = router;

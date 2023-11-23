const express = require('express');
const router = express.Router();
const { 
  createInvestmentPlan, 
  createPlan, 
  subscribeToPlan, 
  approveDeposit , 
  updateDeposit, 
  getPlanById, 
  getAllPlans, 
  getUserPlanById ,
  getAllPlan,
  getSubscribersForUser
} = require('../controllers/planControllers');

// Route to create an investment plan createPlan
router.post('/create', createInvestmentPlan);
router.post('/add', createPlan);
router.post('/subscribe', subscribeToPlan);
// get plans for a particluar user 
router.get('/user/:userId', getSubscribersForUser);


// Get all plans without subs
router.get('/onlyplan', getAllPlan);

// Get all plans 
router.get('/plans', getAllPlans);

// Get plan by ID getUserPlanById
router.get('/plans/:planId', getPlanById);

// Get plan by ID  without subscribers getUserPlanById
router.get('/single/:planId', getUserPlanById);


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







  //,
  //

module.exports = router;

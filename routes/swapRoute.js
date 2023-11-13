const express = require('express');
const router = express.Router();
const { initiateSwap, attachProofAndSetPendingStatus, updateStatusAndAdminNote } = require('../controllers/swapcontroller');

// Route to initiate a swap
router.post('/initiate', async (req, res) => {
    try {
      const { userId, swapToCoin, amount, walletAddress, comment } = req.body;
  
      const newSwap = await initiateSwap(userId, swapToCoin, amount, walletAddress, comment);
  
      if (newSwap) {
        res.status(200).json({
          success: true,
          message: 'Swap initiated successfully',
          data: newSwap,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to initiate swap',
        });
      }
    } catch (error) {
      console.error('Error initiating swap:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });
  

// Route to attach proof and set pending status
router.patch('/Proof/:swapId', async (req, res) => {
    try {
      const { swapId } = req.params;
      const proofData = req.body;
  
      const updatedSwap = await attachProofAndSetPendingStatus(swapId, proofData);
  
      if (updatedSwap) {
        res.status(200).json({
          success: true,
          message: 'Proof attached and status set to pending successfully',
          data: updatedSwap,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Swap not found or failed to update',
        });
      }
    } catch (error) {
      console.error('Error attaching proof and setting pending status:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });


  ////
  

// Route to update status and adminNote
router.put('/status', async (req, res) => {
    try {
      const { swapId, status, adminNote } = req.body;
  
      // Call the updateStatusAndAdminNote function
      const updatedSwap = await updateStatusAndAdminNote(swapId, status, adminNote);
  
      if (updatedSwap) {
        res.status(200).json({
          success: true,
          message: 'Status and adminNote updated successfully',
          data: updatedSwap,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Failed to update status and adminNote',
        });
      }
    } catch (error) {
      console.error('Error updating status and adminNote:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });
  

module.exports = router;

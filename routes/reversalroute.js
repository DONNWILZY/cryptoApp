const express = require('express');
const router = express.Router();
const { initiateRetrieval, updateReversalStatus, attachProofAndSetPendingStatusForReversal, getAllReversals, getReversalById, getAllReversalsForUser, getReversalForUserById } = require('../controllers/reversalController');

// Route to initiate retrieval
router.post('/initiate', async (req, res) => {
  const { userId, amount, depositAddress, withdrawTo, yourAddress, comment } = req.body;

  initiateRetrieval(userId, amount, depositAddress, withdrawTo, yourAddress, comment, (error, result) => {
      if (error) {
          return res.status(500).json({
              success: false,
              message: 'Failed to initiate retrieval',
          });
      }

      res.status(200).json({
          success: true,
          message: 'Retrieval initiated successfully',
          data: result,
      });
  });
});


// Update Reversal status and admin notes
router.put('/status/:reversalId', async (req, res) => {
    try {
        // Extract reversalId, status, and adminNote from the request body
        const reversalId = req.params.reversalId;
        const { status, adminNote } = req.body;

        // Call the updateReversalStatus function to perform the update
        const updatedReversal = await updateReversalStatus(reversalId, status, adminNote);

        // Check if the update was successful
        if (updatedReversal) {
            // Send a success response with the updated Reversal data
            res.status(200).json({
                success: true,
                message: 'Reversal status and admin notes updated successfully',
                data: updatedReversal,
            });
        } else {
            // Send a failure response if the update failed
            res.status(404).json({
                success: false,
                message: 'Failed to update Reversal status and admin notes',
            });
        }
    } catch (error) {
        // Handle any errors that occurred during the update process
        console.error('Error updating Reversal status and admin notes:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});


// Endpoint to attach proof and set pending status for Reversal
router.put('/reversal/:reversalId', async (req, res) => {
    try {
        const reversalId = req.params.reversalId;
        const { proofData } = req.body;

        const updatedReversal = await attachProofAndSetPendingStatusForReversal(reversalId, proofData);

        if (updatedReversal) {
            res.status(200).json({
                success: true,
                message: 'Proof attached, and Reversal status set to pending successfully',
                data: updatedReversal,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Failed to attach proof and set Reversal status to pending',
            });
        }
    } catch (error) {
        console.error('Error attaching proof and setting Reversal status to pending:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

router.get('/reversals', getAllReversals); 

// Get a single reversal by ID
router.get('/reversals/:id', getReversalById);

// Get all reversals for a single user
router.get('/users/:userId', getAllReversalsForUser);

// Get a single reversal for a single user by ID
router.get('/users/:userId/:id', getReversalForUserById);



module.exports = router;

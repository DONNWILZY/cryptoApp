const express = require('express');
const router = express.Router();
const {initiateSell, updateSellStatus, attachProofAndSetPendingStatusForSell, getSellById, getAllSellsForUser, getSellForUserById, getAllSells } = require('../controllers/sellControllers'); //


// Route to initiate a new sell
router.post('/initiate', async (req, res) => {
    try {
      const { userId, coin, amount, walletAddress,CointToReceive, CointTypeToReceive,currency, comment } = req.body;
  
      const newSell = await initiateSell(userId, coin, amount, walletAddress, CointToReceive, CointTypeToReceive, currency, comment);
  
      if (newSell) {
        res.status(201).json({
          success: true,
          message: 'Sell initiated successfully',
          data: newSell,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to initiate sell',
        });
      }
    } catch (error) {
      console.error('Error in sell initiation route:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });

// Route to update sell status
router.put('/status/:sellId', async (req, res) => {
    try {
      const sellId = req.params.sellId;
      const { status, adminNote } = req.body;
  
      const updatedSell = await updateSellStatus(sellId, status, adminNote);
  
      if (updatedSell) {
        res.status(200).json({
          success: true,
          message: 'Sell status and admin notes updated successfully',
          data: updatedSell,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Failed to update sell status and admin notes',
        });
      }
    } catch (error) {
      console.error('Error in sell status update route:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });


  // Route to attach proof and set pending status for sell
router.put('/proof/:sellId', async (req, res) => {
    try {
      const sellId = req.params.sellId;
      const { proofImage, textProof } = req.body;
  
      const updatedSell = await attachProofAndSetPendingStatusForSell(sellId, { proofImage, textProof });
  
      if (updatedSell) {
        res.status(200).json({
          success: true,
          message: 'Proof attached and sell status set to pending successfully',
          data: updatedSell,
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Failed to attach proof and set sell status to pending',
        });
      }
    } catch (error) {
      console.error('Error in attach proof and set pending status route for sell:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });

// Get all sells for all users
router.get('/sells', getAllSells);

// Get a single sell by ID
router.get('/sells/:id', getSellById);

// Get all sells for a single user
router.get('/users/:userId', getAllSellsForUser);

// Get a single sell for a single user by ID
router.get('/users/:userId/:id', getSellForUserById);


module.exports = router;
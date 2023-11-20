const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const cacheManager = require('cache-manager');

/////
const {getUserById, getUserWalletWithConversion} = require('../controllers/userController'); 


router.get('/users/:userId', getUserById);


// Route to get all users and populate their details
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password').populate({
            path: 'subscribedPlans depositProofs buy swap reversal sell',
            select: '-proofImage', // Exclude proofImage field from populated documents
        });

        if (users) {
            res.status(200).json({
                success: true,
                data: users,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No users found.',
            });
        }
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

router.get('/wallet/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Call the controller function to get user wallet with conversion
      const convertedWallet = await getUserWalletWithConversion(userId);
  
      // Send the converted wallet as the response
      res.json({ convertedWallet });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ error: 'Failed to fetch user wallet data' });
    }
  });

module.exports = router;

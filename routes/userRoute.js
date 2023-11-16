const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

/////
const {getUserById} = require('../controllers/userController'); 


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

module.exports = router;

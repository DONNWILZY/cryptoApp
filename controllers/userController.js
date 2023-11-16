
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DepositProof = require('../models/proof');
const Buy = require('../models/Buy'); 
const Sell = require('../models/Sell'); // Adjust the path as needed


const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const getAllUsers = async () => {
    try {
        const users = await User.find({}, '-password').populate({
            path: 'subscribedPlans depositProofs buy swap reversal sell',
            select: '-proofImage', // Exclude proofImage field from populated documents
        });

        return users;
    } catch (error) {
        console.error('Error getting users:', error);
        return null;
    }
};

// Example usage
getAllUsers()
    .then(users => {
        if (users) {
            console.log(users);
        } else {
            console.log('No users found.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });


    const getUserById = async (req, res) => {
        try {
          const userId = req.params.userId;
      
          // Find the user by ID and populate the referenced fields
          const user = await User.findById(userId)
            .select('-password') // Exclude the 'password' field
            .populate('subscribedPlans') // Assuming you have a 'subscribedPlans' field in the User model
            .populate('depositProofs') // Assuming you have a 'depositProofs' field in the User model
            .populate('buy') // Assuming you have a 'buy' field in the User model
            .populate('swap') // Assuming you have a 'swap' field in the User model
            .populate('reversal') // Assuming you have a 'reversal' field in the User model
            .populate('sell'); // Assuming you have a 'sell' field in the User model
      
          if (!user) {
            return res.status(404).json({
              success: false,
              message: 'User not found',
            });
          }
      
          res.status(200).json({
            success: true,
            data: user,
          });
        } catch (error) {
          console.error('Error getting user by ID:', error);
          res.status(500).json({
            success: false,
            message: 'Internal server error',
          });
        }
      };


    
const authController = {
    getAllUsers, getUserById
    
};

module.exports = authController;








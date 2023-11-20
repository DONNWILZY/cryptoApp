
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cacheManager = require('cache-manager');

const User = require('../models/User');
const DepositProof = require('../models/proof');
const Buy = require('../models/Buy'); 
const Sell = require('../models/Sell'); // Adjust the path as needed
const memoryStore = require('cache-manager').caching({ store: 'memory', max: 100, ttl: 3600 });


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

// // Example usage
// getAllUsers()
//     .then(users => {
//         if (users) {
//             console.log(users);
//         } else {
//             console.log('No users found.');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });


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


      const cache = cacheManager.caching({ store: memoryStore, ttl: 3600000 });

      const fetchPriceFromAPI = async (symbol) => {
        try {
          const cachedPrice = await cache.get(symbol);
          if (cachedPrice !== undefined) {
            return cachedPrice;
          }
      
          const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbol}`;
          const response = await axios.get(url);
      
          if (response.status !== 200) {
            throw new Error(`API error fetching price for ${symbol}`);
          }
      
          const price = response.data.length > 0 ? response.data[0].current_price : 0;
          await cache.set(symbol, price, { ttl: 3600000 });
      
          return price;
        } catch (error) {
          console.error(`Error fetching price for ${symbol}: ${error.message}`);
          throw new Error(`Failed to fetch price for ${symbol}`);
        }
      };
      
      const getUserWalletWithConversion = async (userId) => {
        try {
          const user = await User.findById(userId);
      
          if (!user) {
            throw new Error('User not found');
          }
      
          const symbols = ['btc', 'eth', 'bnb', 'usdt'];
      
          const convertedWallet = {
            balance: {},
            investment: {},
            interest: {},
            total: {},
            originalBalance: {
              balance: user.wallet.balance,
              investment: user.wallet.investment,
              interest: user.wallet.interest,
              total: user.wallet.total,
            },
          };
      
          for (const symbol of symbols) {
            const price = await fetchPriceFromAPI(symbol);
            if (price !== 0) {
              convertedWallet.balance[symbol] = user.wallet.balance / price;
              convertedWallet.investment[symbol] = user.wallet.investment / price;
              convertedWallet.interest[symbol] = user.wallet.interest / price;
              convertedWallet.total[symbol] = user.wallet.total / price;
            } else {
              console.warn(`Price unavailable for ${symbol}`);
            }
          }
      
          console.log('Converted Wallet:', convertedWallet);
      
          return convertedWallet;
        } catch (error) {
          console.error(`Error fetching user wallet: ${error.message}`);
          throw new Error('Failed to fetch user wallet data');
        }
      };
      
    
const authController = {
    getAllUsers, getUserById, getUserWalletWithConversion
    
};

module.exports = authController;


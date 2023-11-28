const mongoose = require('mongoose');
const shortid = require('shortid');
const Sell = require('../models/Sell');
const Proof = require('../models/proof');
const User = require('../models/User');

const initiateSell = async (userId, coin, amount, walletAddress, CointToReceive, CointTypeToReceive, comment, callback) => {
  try {
    // Create a new Sell document
    const newSell = new Sell({
      user: userId,
      coin,
      amount,
      walletAddress,
      CointToReceive,
      CointTypeToReceive,
      comment,
    });

    // Save the new sell document
    await newSell.save();

    // Update the user model with the new Sell ObjectId in the 'sell' field
    await User.findByIdAndUpdate(userId, {
      $push: { sell: newSell._id },
    });

    // If a callback function is provided, invoke it with the newly created sell
    if (callback && typeof callback === 'function') {
      callback(null, newSell);
    }

    // Alternatively, you can return the newly created sell if no callback is provided
    return newSell;
  } catch (error) {
    console.error('Error initiating sell:', error);

    // If a callback function is provided, invoke it with the error
    if (callback && typeof callback === 'function') {
      callback(error, null);
    }

    // Alternatively, you can throw the error if no callback is provided
    throw error;
  }
};



  

  const updateSellStatus = async (sellId, status, adminNote) => {
    try {
      // Find the sell by ID
      const sell = await Sell.findById(sellId);
  
      if (!sell) {
        console.log('Sell not found');
        return null;
      }
  
      // Find the associated proof using the sell's proof field
      const proof = await Proof.findById(sell.proof);
  
      if (!proof) {
        console.log('Proof not found');
        return null;
      }
  
      // Generate a unique short ID for the transaction
      const transactionId = shortid.generate();
  
      // Update the status and adminNote on both Sell and Proof
      sell.status = status;
      proof.status = status;
      proof.adminNote = adminNote;
      proof.transactionId = transactionId;
  
      // Save the updated sell and proof
      await Promise.all([sell.save(), proof.save()]);
  
      // Return the updated sell
      return sell;
    } catch (error) {
      console.error('Error updating sell status and adminNote:', error);
      return null;
    }
  };

  const attachProofAndSetPendingStatusForSell = async (sellId, { proofImage, textProof }) => {
    try {
      // Find the sell by ID
      const sell = await Sell.findById(sellId);
  
      if (!sell) {
        console.log('Sell not found');
        return null;
      }
  
      // Generate a unique short ID for the transaction
      const transactionId = shortid.generate();
  
      // Create a new Proof instance
      const newProof = new Proof({
        user: sell.user,
        proofType: 'sell',
        proofImage,
        textProof,
        sell: sell._id,  // Link the proof to the sell
        transactionId,  // Include the generated transaction ID
      });
  
      // Save the new proof
      await newProof.save();
  
      // Update the sell with the proof and set status to 'pending'
      sell.proof = newProof._id;
      sell.status = 'pending';
  
      // Save the updated sell
      await sell.save();
  
      // Return the updated sell
      return sell;
    } catch (error) {
      console.error('Error attaching proof and setting pending status for sell:', error);
      return null;
    }
  };




  const getAllSells = async (req, res) => {
    try {
      const sells = await Sell.find()
        .populate({
          path: 'user',
          select: 'firstName lastName username',
        })
        .populate({
          path: 'proof',
          select: 'proofImage textProof transactionId status',
        });
  
      res.status(200).json({
        success: true,
        data: sells,
      });
    } catch (error) {
      console.error('Error getting sells:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  const getSellById = async (req, res) => {
    try {
      const sellId = req.params.id;
      const sell = await Sell.findById(sellId)
        .populate({
          path: 'user',
          select: 'firstName lastName username',
        })
        .populate({
          path: 'proof',
          select: 'proofImage textProof transactionId status',
        });
  
      if (!sell) {
        return res.status(404).json({
          success: false,
          message: 'Sell not found',
        });
      }
  
      res.status(200).json({
        success: true,
        data: sell,
      });
    } catch (error) {
      console.error('Error getting sell by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  const getAllSellsForUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const sells = await Sell.find({ user: userId })
        .populate({
          path: 'user',
          select: 'firstName lastName username',
        })
        .populate({
          path: 'proof',
          select: 'proofImage textProof transactionId status',
        });
  
      res.status(200).json({
        success: true,
        data: sells,
      });
    } catch (error) {
      console.error('Error getting sells for user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  const getSellForUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const sellId = req.params.id;
      const sell = await Sell.findOne({ _id: sellId, user: userId })
        .populate({
          path: 'user',
          select: 'firstName lastName username',
        })
        .populate({
          path: 'proof',
          select: 'proofImage textProof transactionId status',
        });
  
      if (!sell) {
        return res.status(404).json({
          success: false,
          message: 'Sell not found for the specified user',
        });
      }
  
      res.status(200).json({
        success: true,
        data: sell,
      });
    } catch (error) {
      console.error('Error getting sell for user by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  









  
  





// getSellById, getAllSellsForUser, getSellForUserById, getAllSells

module.exports = {
    initiateSell,
    updateSellStatus,
    attachProofAndSetPendingStatusForSell,
    getSellById, 
    getAllSellsForUser, 
    getSellForUserById, 
    getAllSells

    
  };
const mongoose = require('mongoose');
const shortid = require('shortid');
const Sell = require('../models/Sell');
const Proof = require('../models/proof');

const initiateSell = async (userId, coin, amount, walletAddress, comment) => {
    try {
      // Create a new Sell document
      const newSell = new Sell({
        user: userId,
        coin,
        amount,
        walletAddress,
        comment,
      });
  
      // Save the new sell document
      await newSell.save();
  
      // Return the newly created sell
      return newSell;
    } catch (error) {
      console.error('Error initiating sell:', error);
      return null;
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
  
  







module.exports = {
    initiateSell,
    updateSellStatus,
    attachProofAndSetPendingStatusForSell

    
  };
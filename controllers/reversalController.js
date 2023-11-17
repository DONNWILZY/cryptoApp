const mongoose = require('mongoose');
const shortid = require('shortid');
const Retrieval = require('../models/Reverse');
const Proof = require('../models/proof');
const User = require('../models/User');

// Function to initiate retrieval
const initiateRetrieval = async (userId, amount, depositAddress, withdrawTo, yourAddress, comment, callback) => {
  try {
      // Create a new Retrieval document
      const newRetrieval = new Retrieval({
          user: userId,
          amount,
          depositAddress,
          withdrawTo,
          yourAddress,
          comment,
      });

      // Save the new retrieval document
      await newRetrieval.save();

      // Update the user model with the new Retrieval ObjectId
      await User.findByIdAndUpdate(userId, {
          $push: { reversal: newRetrieval._id }
      });

      // Invoke the callback with the newly created retrieval
      callback(null, newRetrieval);
  } catch (error) {
      console.error('Error initiating retrieval:', error);

      // Invoke the callback with the error
      callback(error, null);
  }
};

// Function to update status and adminNote on Reversal and Proof
const updateReversalStatus = async (reversalId, status, adminNote) => {
    try {
        // Find the reversal by ID
        const reversal = await Retrieval.findById(reversalId);

        if (!reversal) {
            console.log('Reversal not found');
            return null;
        }

        // Find the associated proof using the reversal's proof field
        const proof = await Proof.findById(reversal.proof);

        if (!proof) {
            console.log('Proof not found');
            return null;
        }

        // Generate a unique short ID for the transaction (you may need to import shortid)
        const transactionId = shortid.generate();

        // Update the status and adminNote on both Reversal and Proof
        reversal.status = status;
        proof.status = status;
        proof.adminNote = adminNote;
        proof.transactionId = transactionId;

        // Save the updated reversal and proof
        await Promise.all([reversal.save(), proof.save()]);

        // Return the updated reversal
        return reversal;
    } catch (error) {
        console.error('Error updating reversal status and adminNote:', error);
        return null;
    }
};


const attachProofAndSetPendingStatusForReversal = async (reversalId, { proofImage, textProof }) => {
  try {
      // Find the reversal by ID
      const reversal = await Retrieval.findById(reversalId);

      if (!reversal) {
          console.log('Reversal not found');
          return null;
      }

      // Generate a unique short ID for the transaction
      const transactionId = shortid.generate();

      // Create a new Proof instance
      const newProof = new Proof({
          user: reversal.user,
          proofType: 'reversal',
          proofImage,
          textProof,
          reversal: reversal._id,  // Link the proof to the reversal
          transactionId,  // Include the generated transaction ID
          amount: reversal.reversalFee, // Set amount to reversalFee
      });

      // Save the new proof
      await newProof.save();

      // Update the reversal with the proof and set status to 'pending'
      reversal.proof = newProof._id;
      reversal.status = 'pending';

      // Save the updated reversal
      await reversal.save();

      // Return the updated reversal
      return reversal;
  } catch (error) {
      console.error('Error attaching proof and setting pending status for reversal:', error);
      return null;
  }
};















module.exports = {
  initiateRetrieval,
  updateReversalStatus,
  attachProofAndSetPendingStatusForReversal
  
};

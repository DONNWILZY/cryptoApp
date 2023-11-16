const shortid = require('shortid');
const Proof = require('../models/proof');
const Swap = require('../models/Swap');

const initiateSwap = async (userId, swapToCoin, amount, currentCoin, walletAddress, comment) => {
    try {
        // Create a new Swap document
        const newSwap = new Swap({
            user: userId,
            swapToCoin,
            amount,
            currentCoin,
            walletAddress,
            comment,
        });

        // Save the new swap document
        await newSwap.save();

        // Return the newly created swap
        return newSwap;
    } catch (error) {
        console.error('Error initiating swap:', error);
        return null;
    }
};



const attachProofAndSetPendingStatus = async (swapId, proofData) => {
  try {
    // Find the swap by ID
    const swap = await Swap.findById(swapId);

    if (!swap) {
      console.log('Swap not found');
      return null;
    }

    // Generate a unique short ID for the transaction
    const transactionId = shortid.generate();

    // Create a new Proof instance
    const newProof = new Proof({
      user: swap.user,
      proofType: 'swap',
      ...proofData,
      swap: swap._id,  // Link the proof to the swap
      transactionId,  // Include the generated transaction ID
      amount: swap.amount, // Set amount to the swap amount
    });

    // Save the new proof
    await newProof.save();

    // Update the swap with the proof and set status to 'pending'
    swap.proof = newProof._id;
    swap.status = 'pending';

    // Save the updated swap
    await swap.save();

    // Return the updated swap
    return swap;
  } catch (error) {
    console.error('Error attaching proof and setting pending status:', error);
    return null;
  }
};



// Function to update status and adminNote on Proof and Swap

// Function to update status and adminNote on Proof and Swap
const updateStatusAndAdminNote = async (swapId, status, adminNote) => {
    try {
      // Find the swap by ID
      const swap = await Swap.findById(swapId);
  
      if (!swap) {
        console.log('Swap not found');
        return null;
      }
  
      // Find the associated proof
      const proof = await Proof.findById(swap.proof);
  
      if (!proof) {
        console.log('Proof not found');
        return null;
      }
  
      // Update the status and adminNote on both Proof and Swap
      swap.status = status;
      proof.status = status;
      proof.adminNote = adminNote;
  
      // Save the updated swap and proof
      await Promise.all([swap.save(), proof.save()]);
  
      // Return the updated swap
      return swap;
    } catch (error) {
      console.error('Error updating status and adminNote:', error);
      return null;
    }
  };
  

  
  
  
  

module.exports = {
  initiateSwap,
  attachProofAndSetPendingStatus,
  updateStatusAndAdminNote
};

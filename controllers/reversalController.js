const mongoose = require('mongoose');
const Retrieval = require('../models/retrieval');

// Function to initiate retrieval
const initiateRetrieval = async (userId, amount, depositAddress, withdrawTo, yourAddress, comment) => {
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

    // Return the newly created retrieval
    return newRetrieval;
  } catch (error) {
    console.error('Error initiating retrieval:', error);
    return null;
  }
};

module.exports = {
  initiateRetrieval,
};

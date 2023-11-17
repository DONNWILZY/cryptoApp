const Proof = require('../models/proof');
const  {populate}  = require('mongoose');
const User = require('../models/User');

// Get all proofs of payment with associated data
// Get all proofs with associated data
const getAllProofs = async (req, res) => {
    try {
      const proofs = await Proof.find()
        .populate({
          path: 'user',
          select: 'firstName lastName',
        })
        .populate({
          path: 'investmentPlan',
          select: '-subscribers', // Exclude subscribers field
        })
        .populate('reversal') // Add population for reversal
        .populate('swap'); // Add population for swap
  
      res.status(200).json({
        success: true,
        data: proofs,
      });
    } catch (error) {
      console.error('Error getting proofs:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  


// Get a proof by ID with associated data
// Get a proof by ID with associated data
const getProofById = async (req, res) => {
    try {
      const proofId = req.params.id;
      console.log('Trying to find proof with ID:', proofId);
  
      let proof = await Proof.findById(proofId)
        .populate({
          path: 'user',
          select: 'firstName lastName ',
        })
        .populate({
          path: 'investmentPlan',
          select: '-subscribers', // Exclude subscribers field
        })
        .populate('reversal') // Add population for reversal
        .populate('swap')
        .populate('sell')
       // .populate('buy') uncomment when i add buy
         // Add population for swap
  
      if (!proof) {
        console.log('Proof not found');
        return res.status(404).json({
          success: false,
          message: 'Proof not found',
        });
      }
  
      console.log('Found proof:', proof);
  
      console.log('Populated proof:', proof);
  
      res.status(200).json({
        success: true,
        data: proof,
      });
    } catch (error) {
      console.error('Error getting proof by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  

  
  
  
  
  



module.exports = {
    getAllProofs,
    getProofById,
};

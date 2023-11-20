const express = require('express');
const router = express.Router();
const {getAllProofs, getProofById, getProofsByUserId} = require('../controllers/proofController');

// Route to get all proofs of payment
router.get('/proofs', getAllProofs);

// Route to get a proof by ID
router.get('/proofs/:id', getProofById);

/// all proofs for a user
router.get('/proof/:userId', getProofsByUserId);

module.exports = router;

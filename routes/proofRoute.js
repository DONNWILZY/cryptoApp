const express = require('express');
const router = express.Router();
const {getAllProofs, getProofById} = require('../controllers/proofController');

// Route to get all proofs of payment
router.get('/proofs', getAllProofs);

// Route to get a proof by ID
router.get('/proofs/:id', getProofById);

module.exports = router;

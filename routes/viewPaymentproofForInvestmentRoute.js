const express = require('express');
const router = express.Router();
const { getAllPaymentProofs, getPaymentProofById, getPendingPaymentProofs, getApprovedPaymentProofs, getDeclinedPaymentProofs, getCanceledPaymentProofs } = require('../controllers/viewDepositForPlanController');

// Route to get all payment proofs with user details, plan details, and payment details
router.get('/paymentProofs', async (req, res) => {
  try {
    const paymentProofs = await getAllPaymentProofs();
    res.status(200).json({
      success: true,
      data: paymentProofs,
    });
  } catch (error) {
    console.error('Error fetching all payment proofs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Route to get a single payment proof by ID
router.get('/paymentProofs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const paymentProof = await getPaymentProofById(id);
    if (paymentProof) {
      res.status(200).json({
        success: true,
        data: paymentProof,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Payment proof not found',
      });
    }
  } catch (error) {
    console.error('Error fetching payment proof by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Route to get payment proofs with pending status
router.get('/paymentProofs/pending', async (req, res) => {
  try {
    const pendingPaymentProofs = await getPendingPaymentProofs();
    res.status(200).json({
      success: true,
      data: pendingPaymentProofs,
    });
  } catch (error) {
    console.error('Error fetching pending payment proofs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Route to get payment proofs with approved status
router.get('/paymentProofs/approved', async (req, res) => {
  try {
    const approvedPaymentProofs = await getApprovedPaymentProofs();
    res.status(200).json({
      success: true,
      data: approvedPaymentProofs,
    });
  } catch (error) {
    console.error('Error fetching approved payment proofs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Route to get payment proofs with declined status
router.get('/paymentProofs/declined', async (req, res) => {
  try {
    const declinedPaymentProofs = await getDeclinedPaymentProofs();
    res.status(200).json({
      success: true,
      data: declinedPaymentProofs,
    });
  } catch (error) {
    console.error('Error fetching declined payment proofs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Route to get payment proofs with canceled status
router.get('/paymentProofs/canceled', async (req, res) => {
  try {
    const canceledPaymentProofs = await getCanceledPaymentProofs();
    res.status(200).json({
      success: true,
      data: canceledPaymentProofs,
    });
  } catch (error) {
    console.error('Error fetching canceled payment proofs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

module.exports = router;

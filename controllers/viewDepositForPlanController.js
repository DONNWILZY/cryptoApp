const InvestmentPlan = require('../models/test');
const User = require('../models/User');
const DepositProof = require('../models/PaymentProof');


const getAllPaymentProofs = async () => {
    try {
      const paymentProofs = await DepositProof.find()
        .populate({
          path: 'user',
          select: 'firstname lastname',
        })
        .populate({
          path: 'investmentPlan',
          select: 'name amount',
        })
        .select('paymentStatus paymentDetails');
  
      return paymentProofs;
    } catch (error) {
      console.error('Error getting all payment proofs:', error);
      throw error; // You might want to handle the error more gracefully based on your application's requirements
    }
  };


  // VIEW BY iD
  const getPaymentProofById = async (paymentProofId) => {
    try {
      const paymentProof = await DepositProof.findById(paymentProofId)
        .populate({
          path: 'user',
          select: 'firstname lastname',
        })
        .populate({
          path: 'investmentPlan',
          select: 'name amount',
        })
        .select('paymentStatus paymentDetails');
  
      return paymentProof;
    } catch (error) {
      console.error('Error getting payment proof by ID:', error);
      throw error;
    }
  };

  const getPendingPaymentProofs = async () => {
    try {
      const pendingPaymentProofs = await DepositProof.find({
        'paymentStatus.status': 'pending',
      })
        .populate({
          path: 'user',
          select: 'firstname lastname',
        })
        .populate({
          path: 'investmentPlan',
          select: 'name amount',
        })
        .select('paymentStatus paymentDetails');
  
      return pendingPaymentProofs;
    } catch (error) {
      console.error('Error getting pending payment proofs:', error);
      throw error;
    }
  };
  
  const getApprovedPaymentProofs = async () => {
    try {
      const approvedPaymentProofs = await DepositProof.find({
        'paymentStatus.status': 'approved',
      })
        .populate({
          path: 'user',
          select: 'firstname lastname',
        })
        .populate({
          path: 'investmentPlan',
          select: 'name amount',
        })
        .select('paymentStatus paymentDetails');
  
      return approvedPaymentProofs;
    } catch (error) {
      console.error('Error getting approved payment proofs:', error);
      throw error;
    }
  };
  
  const getDeclinedPaymentProofs = async () => {
    try {
      const declinedPaymentProofs = await DepositProof.find({
        'paymentStatus.status': 'declined',
      })
        .populate({
          path: 'user',
          select: 'firstname lastname',
        })
        .populate({
          path: 'investmentPlan',
          select: 'name amount',
        })
        .select('paymentStatus paymentDetails');
  
      return declinedPaymentProofs;
    } catch (error) {
      console.error('Error getting declined payment proofs:', error);
      throw error;
    }
  };

  const getCanceledPaymentProofs = async () => {
    try {
      const canceledPaymentProofs = await DepositProof.find({
        'paymentStatus.status': 'canceled',
      })
        .populate({
          path: 'user',
          select: 'firstname lastname',
        })
        .populate({
          path: 'investmentPlan',
          select: 'name amount',
        })
        .select('paymentStatus paymentDetails');
  
      return canceledPaymentProofs;
    } catch (error) {
      console.error('Error getting canceled payment proofs:', error);
      throw error;
    }
  };
  
  
  
  

  module.exports = { getAllPaymentProofs, getPaymentProofById, getPendingPaymentProofs, getApprovedPaymentProofs, getDeclinedPaymentProofs , getCanceledPaymentProofs};
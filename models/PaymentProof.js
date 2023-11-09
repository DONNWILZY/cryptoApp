const mongoose = require('mongoose');

const DepositProofSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    investmentPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InvestmentPlan',
        required: true
    },
    proofImage: {
        type: String, 
        required: true
    },
    textProof: {
        type: String, 
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    isApproved: {
        status: {
          type: String,
          enum: ['pending', 'approved', 'declined', 'cancelled'],
          default: 'pending',
        }
    }
});

const DepositProof = mongoose.model('DepositProof', DepositProofSchema);

module.exports = DepositProof;

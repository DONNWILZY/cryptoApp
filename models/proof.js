const mongoose = require('mongoose');

const ProofSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    proofTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        // Reference to any associated document
      },
    proofType: {
      type: String,
      // required: true,
    },
    proofImage: {
      type: String,
      required: true,
    },
    textProof: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    adminNote: {
      type: [String],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined', 'cancelled'],
      default: 'pending',
    },
    investmentPlan: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'InvestmentPlan',
             // required: true
          },
          sawp: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Swap',
           // required: true
        },
        resversal: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resversal',
           // required: true
        },
  
  },
  {
    timestamps: true,
  }
);

const Proof = mongoose.model('Proof', ProofSchema);

module.exports = Proof;

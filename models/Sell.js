const mongoose = require('mongoose');
const ProofSchema = require('./proof'); // Make sure to provide the correct path

const SellSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proof',
    },
    proofType: {
        type: String,
        default: 'Sell Coin',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined', 'cancelled'],
        default: 'pending',
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        required: true
    },

    coin: {
        type: String,
        required: true
    },
  
    walletAddress: {
        type: String,
        required: true
    },

    CointToReceive: {
        type: String,
        required: true
    },

    CointTypeToReceive: {
        type: String,
        required: true
    },
    adminNote: {
        type: [String],
      },
    comment: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

const Sell = mongoose.model('Sell', SellSchema);
module.exports = Sell;

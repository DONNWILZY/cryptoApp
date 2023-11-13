const mongoose = require('mongoose');
const ProofSchema = require('./proof'); // Make sure to provide the correct path

const BuySchema = new mongoose.Schema({
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
    coin: {
        type: String,
        required: true
    },
  
    amount: {
        type: Number,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    comment: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

const Buy = mongoose.model('Buy', BuySchema);
module.exports = Buy;

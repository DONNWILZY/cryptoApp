const mongoose = require('mongoose');
const ProofSchema = require('./proof'); // Make sure to provide the correct path

const BuySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    proofType: {
        type: String,
        default: 'Buy Coin',
    },
    
    proof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proof',
    },

    coin: {
        type: String, // Assuming it represents a type of cryptocurrency
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewing', 'Approved', 'Rejected'],
        default: 'Pending'
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
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Buy = mongoose.model('Buy', BuySchema);
module.exports = Buy;

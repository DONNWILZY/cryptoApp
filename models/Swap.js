const mongoose = require('mongoose');
const ProofSchema = require('./proof');

const SwapSchema = new mongoose.Schema({
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
        default: 'swap',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined', 'cancelled'],
        default: 'pending',
    },
    currentCoin: {
        type: String,
        required: true
    },
    swapToCoin: {
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
        type: String,
       // required: true
    },
    adminNotes: {
        type: [String],
        required: true
    },
    transactionFee: {
        type: Number,
    },
}, {
    timestamps: true
});

// Pre-save hook to calculate transaction fee before saving the document
SwapSchema.pre('save', function (next) {
    // Calculate the transaction fee as 10% of the amount
    this.transactionFee = 0.1 * this.amount;
    next();
});

const Swap = mongoose.model('Swap', SwapSchema);
module.exports = Swap;

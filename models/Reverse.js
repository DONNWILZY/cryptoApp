const mongoose = require('mongoose');
const ProofSchema = require('./proof'); // Make sure to provide the correct path

const ReversalSchema = new mongoose.Schema({
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
        default: 'reversal',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined', 'cancelled'],
        default: 'pending',
    },
    depositAddress: {
        type: String, 
        required: true
    },
    dateInitiated: {
        type: Date, 
        // required: true
    },
    amount: {
        type: Number,
        required: true
    },
    withdrawTo: {
        type: String,
        required: true
    },
    yourAddress: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        //required: true
    },
    reversalFee: {
        type: Number, 
    },
    adminNote: {
        type: [String],
        required: true
    },
}, {
    timestamps: true, // Add timestamps
});

// Pre-save hook to calculate reversalFee before saving the document
ReversalSchema.pre('save', function (next) {
    // Calculate the reversalFee as 10% of the amount
    this.reversalFee = 0.1 * this.amount;
    next();
});

const Reversal = mongoose.model('Reversal', ReversalSchema);
module.exports = Reversal;

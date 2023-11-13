const mongoose = require('mongoose');

const CashDepositSchema = new mongoose.Schema({
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
    amountDeposited: {
        type: Number,
        required: true
    },
    depositStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    depositApprovedDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// const CashDeposit = mongoose.model('CashDeposit', CashDepositSchema);
// module.exports = CashDeposit;


// const mongoose = require('mongoose');
// const ProofSchema = require('./Proof'); // Assuming the path is correct

// const DepositProofSchema = new mongoose.Schema({
//     proofType: {
//         type: String,
//         default: 'deposit',
//         // Additional validation if needed
//     },
//     proof: ProofSchema,
//     // Add other fields specific to DepositProof
// });

// const DepositProof = mongoose.model('DepositProof', DepositProofSchema);

// module.exports = DepositProof;

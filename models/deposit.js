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

const CashDeposit = mongoose.model('CashDeposit', CashDepositSchema);
module.exports = CashDeposit;

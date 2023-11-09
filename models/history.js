const mongoose = require('mongoose');

const TransactionHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    transactionType: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    transactionDate: {
        type: Date,
        default: Date.now
    }
});

const TransactionHistory = mongoose.model('TransactionHistory', TransactionHistorySchema);
module.exports = TransactionHistory;

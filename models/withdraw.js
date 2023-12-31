const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined', 'cancelled'],
    default: 'pending',
  },
  amount: {
    type: Number,
    required: true,
  },
  withdrawalType: {
    type: String,
    enum: ['balanceToPersonalAccount', 'investmentToBalance', 'interestToBalance'],
  },
  // Include these fields conditionally based on withdrawalType
  personalAccountCurrency: {
    type: String,
    required: function() {
      return this.withdrawalType === 'balanceToPersonalAccount';
    },
  },
  personalAccountAddress: {
    type: String,
    required: function() {
      return this.withdrawalType === 'balanceToPersonalAccount';
    },
  },
  balance: {
    type: String,
  },
  investment: {
    type: String,
    // required: true,
  },
  interest: {
    type: String,
    // required: true,
  },
  adminNote: {
    type: [String],
  },
  transactionId: {
    type: String,
  },
}, {
  timestamps: true,
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);
module.exports = Withdraw;

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
  personalAccountCurrency: {
    type: String,
    required: true,
  },
  personalAccountAddress: {
    type: String,
    required: true,
  },

  withdrawalType: {
    type: String,
    enum: ['balanceToPersonalAccount', 'investmentToBalance', 'interestToBalance'],
  },

  adminNote: {
    type: [String],
  },
}, {
  timestamps: true,
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);
module.exports = Withdraw;

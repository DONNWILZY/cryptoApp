
const User = require('../models/User');
const Withdraw = require('../models/withdraw');

const withdraw = async (req, res) => {
  try {
    const { userId, amount, personalAccountCurrency, personalAccountAddress, withdrawalType } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check the withdrawal type and update the user's wallet accordingly
    switch (withdrawalType) {
      case 'balanceToPersonalAccount':
        // Consider the withdrawal amount as pending for balanceToPersonalAccount
        const withdrawalBalanceToPersonal = new Withdraw({
          user: userId,
          amount,
          withdrawalType,
          status: 'pending', // Set status as pending
          personalAccountCurrency,
          personalAccountAddress,
        });
        await withdrawalBalanceToPersonal.save();
        break;

      case 'investmentToBalance':
        if (user.wallet.investment >= amount) {
          user.wallet.investment -= amount;
          user.wallet.balance += amount;
          user.wallet.total -= amount; // Adjust total wallet value

          // Set 'approved' status for investmentToBalance by default
          const withdrawalInvestment = new Withdraw({
            user: userId,
            amount,
            withdrawalType,
            status: 'approved', // Set default status
            personalAccountCurrency,
            personalAccountAddress,
          });
          await withdrawalInvestment.save();
        } else {
          return res.status(400).json({ error: 'Insufficient investment balance' });
        }
        break;

      case 'interestToBalance':
        if (user.wallet.interest >= amount) {
          user.wallet.interest -= amount;
          user.wallet.balance += amount;
          user.wallet.total += amount; // Adjust total wallet value

          // Set 'approved' status for interestToBalance by default
          const withdrawalInterest = new Withdraw({
            user: userId,
            amount,
            withdrawalType,
            status: 'approved', // Set default status
            personalAccountCurrency,
            personalAccountAddress,
          });
          await withdrawalInterest.save();
        } else {
          return res.status(400).json({ error: 'Insufficient interest balance' });
        }
        break;

      default:
        return res.status(400).json({ error: 'Invalid withdrawal type' });
    }

    // Save the updated user data
    await user.save();

    // Return withdrawal response data
    const responseData = {
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        user: userId,
        amount,
        withdrawalType,
        status: withdrawalType === 'balanceToPersonalAccount' ? 'pending' : 'approved',
        personalAccountCurrency,
        personalAccountAddress,
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const updateWithdrawal = async (req, res) => {
  try {
    const { withdrawalId, status, adminNotes } = req.body;

    // Find the withdrawal by ID
    const withdrawal = await Withdraw.findById(withdrawalId);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    // Store the current status before updating
    const currentStatus = withdrawal.status;

    // Update the withdrawal status and adminNote
    withdrawal.status = status;
    if (adminNotes && Array.isArray(adminNotes)) {
      withdrawal.adminNote.push(...adminNotes);
    }

    // Update user's wallet based on the status change
    const user = await User.findById(withdrawal.user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (currentStatus === 'pending' && status === 'approved') {
      // Subtract the balance value if changing from pending to approved
      if (withdrawal.withdrawalType === 'balanceToPersonalAccount') {
        user.wallet.balance -= withdrawal.amount;
        user.wallet.total -= withdrawal.amount;
      }
    } else if (currentStatus === 'approved' && status !== 'approved') {
      // Add the balance value back if changing from approved to pending or others
      if (withdrawal.withdrawalType === 'balanceToPersonalAccount') {
        user.wallet.balance += withdrawal.amount;
        user.wallet.total += withdrawal.amount;
      }
    }

    // Save the updated withdrawal and user data
    await withdrawal.save();
    await user.save();

    // Return updated withdrawal response data
    const responseData = {
      message: 'Withdrawal status updated successfully',
      withdrawal: {
        _id: withdrawal._id,
        user: withdrawal.user,
        amount: withdrawal.amount,
        withdrawalType: withdrawal.withdrawalType,
        status: withdrawal.status,
        personalAccountCurrency: withdrawal.personalAccountCurrency,
        personalAccountAddress: withdrawal.personalAccountAddress,
        adminNote: withdrawal.adminNote,
        createdAt: withdrawal.createdAt,
        updatedAt: withdrawal.updatedAt,
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





const withdrawController = {
  withdraw,
  updateWithdrawal,
    
};

module.exports = withdrawController;

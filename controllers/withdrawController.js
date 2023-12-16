
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




const withdrawController = {
  withdraw
    
};

module.exports = withdrawController;

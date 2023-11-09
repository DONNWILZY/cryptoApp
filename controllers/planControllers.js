const InvestmentPlan = require('../models/test');
const User = require('../models/User');
const DepositProof = require('../models/PaymentProof');

const createInvestmentPlan = async (req, res) => {
    try {
        const { planName, amount, description, interestPercentage, duration } = req.body;

        // Calculate the total profit
        const totalProfit = amount * (interestPercentage / 100) * duration;

        const newInvestmentPlan = new InvestmentPlan({
            planName,
            amount,
            description,
            interestPercentage,
            totalProfit, // Calculated total profit
            duration,
            
        });

        const savedPlan = await newInvestmentPlan.save();

        res.status(201).json({ status: 'success', plan: savedPlan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'failed', message: 'Server Error' });
    }
};


// Controller function for creating an investment plan
const createPlan = async (req, res) => {
    try {
      // Extract data from the request body
      const { name, description, amount, interestPercentage, duration, durationType } = req.body;
  
      // Create a new InvestmentPlan instance
      const newInvestmentPlan = new InvestmentPlan({
        name,
        description,
        amount,
        interestPercentage,
        duration,
        durationType,
      });
  
      // Save the new investment plan to the database
      await newInvestmentPlan.save();
  
      // Respond with a success message and the created plan
      res.status(201).json({
        success: true,
        message: 'Investment plan created successfully',
        data: newInvestmentPlan,
      });
    } catch (error) {
      // Handle any errors and respond with an error message
      console.error('Error creating investment plan:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  ////subcribe to plan
  const subscribeToPlan = async (req, res) => {
    try {
      const { userId, planId, proofImage, textProof } = req.body;
  
      // Check if the user and plan exist
      const user = await User.findById(userId);
      const plan = await InvestmentPlan.findById(planId);
  
      if (!user || !plan) {
        return res.status(404).json({
          success: false,
          message: 'User or investment plan not found',
        });
      }
  
      // Check if the user is already subscribed to the plan
      if (user.subscribedPlans.includes(planId)) {
        return res.status(400).json({
          success: false,
          message: 'User is already subscribed to this plan',
        });
      }
  
      // Create a deposit proof
      const depositProof = new DepositProof({
        user: userId,
        investmentPlan: planId,
        proofImage,
        textProof,
      });
  
      // Save the deposit proof
      await depositProof.save();
  
      // Add the plan to the user's subscribedPlans array
      user.subscribedPlans.push(planId);
      user.depositProofs.push(depositProof._id); // Reference to the deposit proof
      await user.save();
  
      // Add the user to the plan's subscribers array
      const subscriptionStart = Date.now();
      const subscriptionEnd = calculateSubscriptionEnd(plan.durationType, plan.duration, subscriptionStart);
  
      plan.subscribers.push({
        user: userId,
        paymentInfo: {
          depositProof: depositProof._id,
          isApproved: {
            status: 'pending',
          },
        },
        subscriptionStart,
        subscriptionEnd,
      });
  
      // Save the updated plan
      await plan.save();
  
      // Respond with a success message and the updated user
      res.status(200).json({
        success: true,
        message: 'User subscribed to the plan successfully',
        data: user,
      });
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  
  const calculateSubscriptionEnd = (durationType, duration, start) => {
    if (durationType === 'hours') {
      return new Date(start + duration * 60 * 60 * 1000);
    } else if (durationType === 'days') {
      return new Date(start + duration * 24 * 60 * 60 * 1000);
    }
  };

  const approveDeposit = async (depositProofId) => {
    try {
      // Find the deposit proof
      const depositProof = await DepositProof.findById(depositProofId).populate('user investmentPlan');
  
      // Check if the deposit proof exists
      if (!depositProof) {
        console.log('Deposit proof not found');
        return;
      }
  
      // Check if the deposit proof is already approved
      if (depositProof.isApproved.status === 'approved') {
        console.log('Deposit proof is already approved');
        return;
      }
  
      // Update the deposit proof status to approved
      depositProof.isApproved.status = 'approved';
      await depositProof.save();
  
      // Update the plan's subscriber with the approved deposit proof
      const planSubscriber = depositProof.investmentPlan.subscribers.find(subscriber => subscriber.user.equals(depositProof.user._id));
      if (planSubscriber) {
        planSubscriber.paymentInfo.isApproved.status = 'approved';
        await depositProof.investmentPlan.save();
      }
  
      // Update the user's wallet with the deposit amount
      depositProof.user.wallet.balance += depositProof.investmentPlan.amount;
      await depositProof.user.save();
  
      // Check if the subscription has ended and add totalProfit to the user's wallet
      const currentDate = new Date();
      if (currentDate >= planSubscriber.subscriptionEnd) {
        depositProof.user.wallet.balance += depositProof.investmentPlan.totalProfit;
        await depositProof.user.save();
      }
  
      console.log('Deposit proof approved successfully');
    } catch (error) {
      console.error('Error approving deposit proof:', error);
    }
  };
  
  

module.exports = { createInvestmentPlan, createPlan, subscribeToPlan, approveDeposit };

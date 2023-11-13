const InvestmentPlan = require('../models/Plan');
const User = require('../models/User');
const DepositProof = require('../models/proof');
const Proof = require('../models/proof');
const shortid = require('shortid');

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


  ////// SUNSCRIBE TO PLAN
  const subscribeToPlan = async (req, res) => {
    try {
      const { userId, planId, proofImage, textProof } = req.body;
  
      const user = await User.findById(userId);
      const plan = await InvestmentPlan.findById(planId);
  
      if (!user || !plan) {
        return res.status(404).json({
          success: false,
          message: 'User or investment plan not found',
        });
      }
  
      if (user.subscribedPlans.includes(planId)) {
        return res.status(400).json({
          success: false,
          message: 'User is already subscribed to this plan',
        });
      }
  
      // Generate a unique short ID for the transaction
      const options = {
        length: 5,  // option = digits to be generatedd
      };

      const transactionId = shortid.generate(options);
      console.log(transactionId);
  
      const depositProof = new DepositProof({
        user: userId,
        investmentPlan: planId,
        proofImage,
        textProof,
        proofType: 'investment',
        transactionId, // Include the generated transaction ID
      });
  
      try {
        await depositProof.save();
  
        // Update proof type and proof type ID
        const proofTypeId = depositProof._id;
        depositProof.proofTypeId = proofTypeId;
        depositProof.proofType = 'investment';
  
        await depositProof.save();
      } catch (error) {
        console.error('Error saving deposit proof:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to save deposit proof',
        });
      }
  
      user.subscribedPlans.push(planId);
      user.depositProofs.push(depositProof._id);
  
      await user.save();
  
      const subscriptionStart = Date.now();
      const subscriptionEnd = calculateSubscriptionEnd(plan.durationType, plan.duration, subscriptionStart);
  
      plan.subscribers.push({
        user: userId,
        paymentInfo: {
          depositProof: depositProof._id,
          status: 'pending',
        },
        subscriptionStart,
        subscriptionEnd,
      });
  
      await plan.save();
  
      res.status(200).json({
        success: true,
        message: 'User subscribed to the plan successfully',
        data: user, /// remember to remove password from response 
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


  //// APPROVE JUST DEPOSIT
  const approveDeposit = async (depositProofId, status, adminNote) => {
    try {
      // Find the deposit proof
      const depositProof = await DepositProof.findById(depositProofId).populate('user investmentPlan');
  
      // Check if the deposit proof exists
      if (!depositProof) {
        console.log('Deposit proof not found');
        return null;
      }
  
      // Check if the deposit proof is already approved
      if (depositProof.status === 'approved') {
        console.log('Deposit proof is already approved');
        return null;
      }
  
      // Update the deposit proof status and admin note
      depositProof.status = status;
      depositProof.adminNote = adminNote;
      await depositProof.save();
  
      // Check if the proof has a corresponding investment plan
      if (depositProof.investmentPlan) {
        // Update the plan's subscriber with the approved deposit proof
        const planSubscriber = depositProof.investmentPlan.subscribers.find(subscriber => subscriber.user.equals(depositProof.user._id));
  
        if (planSubscriber) {
          // Update status, start time, and end time
          planSubscriber.paymentInfo.status = status;
          planSubscriber.subscriptionStart = new Date();
  
          // Update subscription end date based on durationType
          const currentDate = new Date();
          if (depositProof.investmentPlan.durationType === 'hours') {
            planSubscriber.subscriptionEnd = new Date(currentDate.getTime() + depositProof.investmentPlan.duration * 60 * 60 * 1000);
          } else if (depositProof.investmentPlan.durationType === 'days') {
            planSubscriber.subscriptionEnd = new Date(currentDate.getTime() + depositProof.investmentPlan.duration * 24 * 60 * 60 * 1000);
          }
  
          await depositProof.investmentPlan.save();
        }
      }
  
      // Update the user's wallet with the deposit amount for investment
      depositProof.user.wallet.investment += depositProof.investmentPlan.amount;
      console.log(depositProof.user.wallet.investment);
      await depositProof.user.save();
  
      console.log('Deposit proof approved successfully');
  
      // Return the approved deposit proof
      return depositProof.toObject();
    } catch (error) {
      console.error('Error approving deposit proof:', error);
      return null;
    }
  };



  const updateDeposit = async (depositProofId, updateData) => {
    try {
        // Find the deposit proof
        const depositProof = await DepositProof.findById(depositProofId).populate('user investmentPlan');

        // Check if the deposit proof exists
        if (!depositProof) {
            console.log('Deposit proof not found');
            return null;
        }

        // Save the current status for comparison later
        const currentStatus = depositProof.status;

        // Update the deposit proof status and/or admin note
        if (updateData.status !== undefined) {
            depositProof.status = updateData.status;
        }

        if (updateData.adminNote !== undefined) {
            depositProof.adminNote = updateData.adminNote;
        }

        // Save the updated deposit proof
        await depositProof.save();

        // Check if the proof has a corresponding investment plan
        if (depositProof.investmentPlan) {
            // Update the plan's subscriber with the updated deposit proof
            const planSubscriber = depositProof.investmentPlan.subscribers.find(
                (subscriber) => subscriber.user && subscriber.user.equals(depositProof.user._id)
            );

            if (planSubscriber) {
                // Update status, start time, and end time
                if (updateData.status !== undefined) {
                    planSubscriber.paymentInfo.status = updateData.status;
                }

                // Update subscription start date based on current date and time
                planSubscriber.subscriptionStart = new Date();

                // Update subscription end date based on durationType
                const currentDate = new Date();
                if (depositProof.investmentPlan.durationType === 'hours') {
                    planSubscriber.subscriptionEnd = new Date(
                        currentDate.getTime() + depositProof.investmentPlan.duration * 60 * 60 * 1000
                    );
                } else if (depositProof.investmentPlan.durationType === 'days') {
                    planSubscriber.subscriptionEnd = new Date(
                        currentDate.getTime() + depositProof.investmentPlan.duration * 24 * 60 * 60 * 1000
                    );
                }

                await depositProof.investmentPlan.save();
            }
        }

        // Update the user's wallet with the deposit amount for investment
        if (updateData.status === 'approved' && depositProof.investmentPlan) {
            depositProof.user.wallet.investment += depositProof.investmentPlan.amount;
            console.log(depositProof.user.wallet.investment);
        } else if (
            (currentStatus === 'approved' || currentStatus === 'pending') &&
            (updateData.status === 'declined' || updateData.status === 'cancelled')
        ) {
            // Reverse the amount added to the wallet if the status changes from approved or pending to declined or cancelled
            depositProof.user.wallet.investment -= depositProof.investmentPlan.amount;
            console.log(depositProof.user.wallet.investment);
        }

        // Save the updated user
        await depositProof.user.save();

        console.log('Deposit proof updated successfully');

        // Return the updated deposit proof
        return depositProof.toObject();
    } catch (error) {
        console.error('Error updating deposit proof:', error.message);
        return null;
    }
};




  


  
  







  
  
  
  
  
  
  
  
 
  
  

  
  
  

module.exports = { createInvestmentPlan, createPlan, subscribeToPlan, approveDeposit , updateDeposit};

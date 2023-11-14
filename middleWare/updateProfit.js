// const updateProfitAndMoveToWallet = async () => {
//   const currentDate = new Date();
//   const plans = await InvestmentPlan.find({
//     'subscribers.subscriptionEnd': { $lte: currentDate },
//     'subscribers.paymentInfo.status': 'approved' // Use the correct path to the payment status
//   });

//   for (const plan of plans) {
//     for (const subscriber of plan.subscribers) {
//       if (currentDate >= subscriber.subscriptionEnd) {
//         // Ensure interestCounter is initialized
//         if (!subscriber.interestCounter) {
//           subscriber.interestCounter = {
//             perHour: 0,
//             perDay: 0
//           };
//         }

//         // Calculate profit per hour and per day
//         const profitPerHour = subscriber.interestCounter.perHour / plan.duration;
//         const profitPerDay = subscriber.interestCounter.perDay / plan.duration;

//         // Add the calculated profit to the user's wallet
//         subscriber.user.wallet.balance += (profitPerHour || 0) + (profitPerDay || 0);

//         // Reset counters
//         subscriber.interestCounter.perHour = 0;
//         subscriber.interestCounter.perDay = 0;
//       }
//     }

//     // Save the updated plan outside the inner loop
//     await plan.save();
//   }
// };

// Import necessary models or dependencies
const InvestmentPlan = require('../models/Plan');
const user = require('../models/User');
const updateProfitAndMoveToWallet = async () => {
  try {
    const currentDate = new Date();
    const plans = await InvestmentPlan.find({
      'subscribers.subscriptionEnd': { $lte: currentDate },
      'subscribers.paymentInfo.status': 'approved',
    }).populate('subscribers.user');

    for (const plan of plans) {
      for (const subscriber of plan.subscribers) {
        if (currentDate >= subscriber.subscriptionEnd) {
          // Check if user and wallet exist before updating
          if (subscriber.user && subscriber.user.wallet) {
            subscriber.user.wallet.interest += subscriber.interestCounter.perHour +
              subscriber.interestCounter.perDay;

            // Reset counters
            subscriber.interestCounter.perHour = 0;
            subscriber.interestCounter.perDay = 0;

            // Update plan status to 'completed'
            subscriber.planStatus = 'completed';

            // Save the updated user and subscriber
            await Promise.all([subscriber.user.save(), subscriber.save()]);
          } else {
            console.error('User or wallet not found:', subscriber.user);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating profit and moving to wallet:', error);
  }
};



// // Function definition
// const updateProfitAndMoveToWallet = async () => {
//   try {
//       const currentDate = new Date();
//       const plans = await InvestmentPlan.find({
//           'subscribers.subscriptionEnd': { $lte: currentDate },
//           'subscribers.paymentInfo.status': 'approved',
//       }).populate('subscribers.user'); // Populate the user field in subscribers

//       for (const plan of plans) {
//           for (const subscriber of plan.subscribers) {
//               if (currentDate >= subscriber.subscriptionEnd) {
//                   // Check if user and wallet exist before updating
//                   if (subscriber.user && subscriber.user.wallet) {
//                       subscriber.user.wallet.balance += subscriber.interestCounter.perHour +
//                           subscriber.interestCounter.perDay;

//                       // Reset counters
//                       subscriber.interestCounter.perHour = 0;
//                       subscriber.interestCounter.perDay = 0;

//                       // Save the updated user
//                       await subscriber.user.save();
//                   } else {
//                       console.error('User or wallet not found:', subscriber.user);
//                   }
//               }
//           }
//       }
//   } catch (error) {
//       console.error('Error updating profit and moving to wallet:', error);
//   }
// };



// Export the function if needed
module.exports = updateProfitAndMoveToWallet;
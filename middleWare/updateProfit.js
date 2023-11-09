// Function to be called periodically ( using cron job)
// const updateProfitAndMoveToWallet = async () => {
//     const currentDate = new Date();
//     const plans = await InvestmentPlan.find({ 'subscribers.subscriptionEnd': { $lte: currentDate } });
  
//     for (const plan of plans) {
//       for (const subscriber of plan.subscribers) {
//         if (currentDate >= subscriber.subscriptionEnd) {
//           subscriber.user.wallet.balance += subscriber.paymentInfo.interestCounter.perHour +
//             subscriber.paymentInfo.interestCounter.perDay;
  
//           // Reset counters
//           subscriber.paymentInfo.interestCounter.perHour = 0;
//           subscriber.paymentInfo.interestCounter.perDay = 0;
//         }
//       }
//     }
//   };

  const updateProfitAndMoveToWallet = async () => {
    const currentDate = new Date();
    const plans = await InvestmentPlan.find({
      'subscribers.subscriptionEnd': { $lte: currentDate },
      'subscribers.paymentInfo.isApproved.status': 'approved' // Only consider plans with approved payment proofs
    });
  
    for (const plan of plans) {
      for (const subscriber of plan.subscribers) {
        if (currentDate >= subscriber.subscriptionEnd) {
          subscriber.user.wallet.balance += subscriber.paymentInfo.interestCounter.perHour +
            subscriber.paymentInfo.interestCounter.perDay;
  
          // Reset counters
          subscriber.paymentInfo.interestCounter.perHour = 0;
          subscriber.paymentInfo.interestCounter.perDay = 0;
        }
      }
    }
  };
  
  
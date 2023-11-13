const updateDeposit = async (depositProofId, updateData) => {
  try {
      // Find the deposit proof
      const depositProof = await DepositProof.findById(depositProofId).populate('user investmentPlan');

      // Check if the deposit proof exists
      if (!depositProof) {
          console.log('Deposit proof not found');
          return null;
      }

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
              (subscriber) => subscriber.user.equals(depositProof.user._id)
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
          await depositProof.user.save();
      }

      console.log('Deposit proof updated successfully');

      // Return the updated deposit proof
      return depositProof.toObject();
  } catch (error) {
      console.error('Error updating deposit proof:', error.message);
      return null;
  }
};


router.patch('/status/:depositProofId', async (req, res) => {
  try {
      const { depositProofId } = req.params;
      const updateData = req.body; // Extract update data from the request body

      const updatedDepositProof = await updateDeposit(depositProofId, updateData);

      if (updatedDepositProof) {
          res.status(200).json({
              success: true,
              message: 'Deposit proof updated successfully',
              data: updatedDepositProof,
          });
      } else {
          res.status(404).json({
              success: false,
              message: 'Deposit proof not found or failed to update',
          });
      }
  } catch (error) {
      console.error('Error updating deposit proof:', error);
      res.status(500).json({
          success: false,
          message: 'Internal server error',
      });
  }
});
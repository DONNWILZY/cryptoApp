const mongoose = require("mongoose");

const InvestmentPlanSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    interestPercentage: {
      type: Number, // Interest percentage
      required: true,
    },
    duration: {
      type: Number, // Duration in days or hours
      required: true,
    },
    durationType: {
        type: String,
        enum: ['days', 'hours'],
    },
    totalProfit: {
      type: Number,
      // required: true,
    },
    total: {
      type: Number,
      // required: true,
    },
   
    subscribers: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        paymentInfo: {
          depositProof: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DepositProof',
          },
          isApproved: {
            status: {
              type: String,
              enum: ['pending', 'approved', 'declined', 'cancelled'],
              default: 'pending',
            },
          },
          interestCounter: {
            perHour: {
              type: Number,
              default: 0,
            },
            perDay: {
              type: Number,
              default: 0,
            },
          },
        },
        subscriptionStart: {
          type: Date,
          default: Date.now,
        },
        subscriptionEnd: {
          type: Date,
          default: function () {
            return new Date(Date.now() + this.duration * 24 * 60 * 60 * 1000);
          },
        },
      }],
      
  });

// Pre hook to calculate totalProfit and total based on durationType
InvestmentPlanSchema.pre('save', function (next) {
  if (this.durationType === 'hours') {
    this.totalProfit = (this.amount * this.interestPercentage * (this.duration / 24)) / 100;
  } else if (this.durationType === 'days') {
    this.totalProfit = (this.amount * this.interestPercentage * this.duration) / 100;
  }

  this.total = this.totalProfit + this.amount;
  next();
});

// // Pre hook to update isApproved based on DepositProof status
// InvestmentPlanSchema.pre('save', async function(next) {
//   const subscribers = this.subscribers;

//   for (const subscriber of subscribers) {
//     const depositProofId = subscriber.paymentInfo.depositProof;

//     if (depositProofId) {
//       try {
//         const depositProof = await mongoose.model('DepositProof').findById(depositProofId);

//         if (depositProof && depositProof.approved) {
//           subscriber.paymentInfo.isApproved = true;
//         }
//       } catch (error) {
//         console.error('Error checking DepositProof status:', error);
//         // Handle the error gracefully based on your application's requirements
//       }
//     }
//   }

//   next();
// });
InvestmentPlanSchema.pre('save', async function (next) {
    const subscribers = this.subscribers;
  
    for (const subscriber of subscribers) {
      const depositProofId = subscriber.paymentInfo.depositProof;
  
      if (depositProofId) {
        try {
          const depositProof = await mongoose.model('DepositProof').findById(depositProofId);
  
          if (depositProof && depositProof.approved) {
            subscriber.paymentInfo.isApproved = true;
          }
        } catch (error) {
          console.error('Error checking DepositProof status:', error);
          // Handle the error gracefully based on your application's requirements
        }
      }
    }
  
    next();
  });

  InvestmentPlanSchema.pre('save', function (next) {
    if (this.durationType === 'hours') {
      this.totalProfit = (this.amount * this.interestPercentage * (this.duration / 24)) / 100;
      this.subscribers.forEach(subscriber => {
        subscriber.paymentInfo.interestCounter.perHour += this.totalProfit / this.duration;
      });
    } else if (this.durationType === 'days') {
      this.totalProfit = (this.amount * this.interestPercentage * this.duration) / 100;
      this.subscribers.forEach(subscriber => {
        subscriber.paymentInfo.interestCounter.perDay += this.totalProfit / this.duration;
      });
    }
  
    this.total = this.totalProfit + this.amount;
    next();
  });
  
  

const InvestmentPlan = mongoose.model('InvestmentPlan', InvestmentPlanSchema);

module.exports = InvestmentPlan;

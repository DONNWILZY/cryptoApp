const mongoose = require("mongoose");
const ProofSchema = require('./proof');

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
         adminNote: {
      type: [String],
    //   required: true,
    },
    paymentInfo: {
      proofType: {
        type: String,
        default: 'investment',
      },
      proof: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proof',
      },
      status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
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
        planStatus: {
          type: String,
          enum: ['pending', 'approved', 'declined', 'cancelled', 'completed'],
          default: 'pending',
        },
      }],
      
  });

  InvestmentPlanSchema.pre('save', async function (next) {
    try {
      if (this.durationType === 'hours' || this.durationType === 'days') {
        // Initialize counters to 0 for new subscribers
        if (this.isNew) {
          this.subscribers.forEach(subscriber => {
            subscriber.interestCounter = {
              perHour: 0,
              perDay: 0
            };
          });
        }
      } else {
        console.error('Invalid durationType:', this.durationType);
      }
  
      // Ensure that this.wallet is defined before accessing its properties
      if (this.wallet) {
        // Calculate the total value by summing up all wallet fields
        this.wallet.total = (this.wallet.balance || 0) + (this.wallet.investment || 0) + (this.wallet.interest || 0);
      } else {
        console.error('Wallet is undefined.');
      }
    } catch (error) {
      console.error('Error initializing counters or calculating total:', error);
    }
  
    next();
  });
  
//   InvestmentPlanSchema.pre('save', async function (next) {
//     try {
//         if (this.durationType === 'hours' || this.durationType === 'days') {
//             // Initialize counters to 0 for new subscribers
//             if (this.isNew) {
//                 this.subscribers.forEach(subscriber => {
//                     subscriber.interestCounter = {
//                         perHour: 0,
//                         perDay: 0
//                     };
//                 });
//             }
//         } else {
//             console.error('Invalid durationType:', this.durationType);
//         }

//         // Calculate the total value by summing up all wallet fields
//         this.wallet.total = this.wallet.balance + this.wallet.investment + this.wallet.interest;
//     } catch (error) {
//         console.error('Error initializing counters or calculating total:', error);
//     }

//     next();
// });


  
  
  

const InvestmentPlan = mongoose.model('InvestmentPlan', InvestmentPlanSchema);

module.exports = InvestmentPlan;

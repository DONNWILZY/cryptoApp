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
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  durationType: {
    type: String,
    enum: ['days', 'hours'],
  },
  totalProfit: {
    type: Number,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  total: {
    type: Number,
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
        enum: ['pending', 'approved', 'declined', 'cancelled', 'completed'],
        default: 'pending',
       
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
      enum: ['active', 'completed'],
        default: 'active',
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

    // Calculate the total value by summing up all interest counters
    this.total = this.subscribers.reduce((total, subscriber) => {
      return total + subscriber.interestCounter.perHour + subscriber.interestCounter.perDay;
    }, 0);

    // Calculate totalProfit based on interestPercentage and amount
    if (this.amount && this.interestPercentage) {
      this.totalProfit = (this.amount * this.interestPercentage) / 100;
      // Update total to be the sum of totalProfit and amount
      this.total = this.totalProfit + this.amount;
    }
  } catch (error) {
    console.error('Error initializing counters or calculating total:', error);
  }

  next();
});

InvestmentPlanSchema.pre('validate', function (next) {
  // Calculate interestPercentage based on totalProfit and amount
  if (this.totalProfit && this.amount) {
    this.interestPercentage = (this.totalProfit / this.amount) * 100;
  }

  next();
});

// InvestmentPlanSchema.pre('save', async function (next) {
//   try {
//     if (this.durationType === 'hours' || this.durationType === 'days') {
//       // Initialize counters to 0 for new subscribers
//       if (this.isNew) {
//         this.subscribers.forEach(subscriber => {
//           subscriber.interestCounter = {
//             perHour: 0,
//             perDay: 0
//           };
//         });
//       }
//     } else {
//       console.error('Invalid durationType:', this.durationType);
//     }

//     // Calculate the total value by summing up all interest counters
//     this.total = this.subscribers.reduce((total, subscriber) => {
//       return total + subscriber.interestCounter.perHour + subscriber.interestCounter.perDay;
//     }, 0);

//     // Calculate totalProfit based on interestPercentage and amount
//     if (this.amount && this.interestPercentage) {
//       this.totalProfit = (this.amount * this.interestPercentage) / 100;
//     }
//   } catch (error) {
//     console.error('Error initializing counters or calculating total:', error);
//   }

//   next();
// });

// InvestmentPlanSchema.pre('validate', function (next) {
//   // Calculate interestPercentage based on totalProfit and amount
//   if (this.totalProfit && this.amount) {
//     this.interestPercentage = (this.totalProfit / this.amount) * 100;
//   }

//   next();
// });

const InvestmentPlan = mongoose.model('InvestmentPlan', InvestmentPlanSchema);

module.exports = InvestmentPlan;

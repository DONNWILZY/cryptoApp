// const mongoose = require("mongoose");
// const ProofSchema = require('./proof');

// const InvestmentPlanSchema = new mongoose.Schema({
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     interestPercentage: {
//       type: Number, // Interest percentage
//       required: true,
//     },
//     duration: {
//       type: Number, // Duration in days or hours
//       required: true,
//     },
//     durationType: {
//         type: String,
//         enum: ['days', 'hours'],
//     },
//     totalProfit: {
//       type: Number,
//       // required: true,
//     },
//     total: {
//       type: Number,
//       // required: true,
//     },
   
//     subscribers: [{
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User',
//         },
//         interestCounter: {
//           perHour: {
//             type: Number,
//             default: 0,
//           },
//           perDay: {
//             type: Number,
//             default: 0,
//           },
//         },
//          adminNote: {
//       type: [String],
//     //   required: true,
//     },
//         paymentInfo: {
//           depositProof: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'DepositProof',
//           },
//           isApproved: {
//             status: {
//               type: String,
//               enum: ['pending', 'approved', 'declined', 'cancelled'],
//               default: 'pending',
//             },
//           },
//         },
//         subscriptionStart: {
//           type: Date,
//           default: Date.now,
//         },
//         subscriptionEnd: {
//           type: Date,
//           default: function () {
//             return new Date(Date.now() + this.duration * 24 * 60 * 60 * 1000);
//           },
//         },
//       }],
      
//   });

  
//   InvestmentPlanSchema.pre('save', async function (next) {
//     try {
//       if (this.durationType === 'hours' || this.durationType === 'days') {
//         this.totalProfit = (this.amount * this.interestPercentage * this.duration) / 100;
  
//         // if (this.subscribers && Array.isArray(this.subscribers)) {
//         //   this.subscribers.forEach(subscriber => {
//         //     if (!subscriber.interestCounter) {
//         //       subscriber.interestCounter = {};
//         //     }
  
//         //     // Check if the subscriber's payment is approved before updating interest counters
//         //     if (subscriber.paymentInfo.isApproved.status === 'approved') {
//         //       if (this.durationType === 'hours') {
//         //         subscriber.interestCounter.perHour = (subscriber.interestCounter.perHour || 0) + this.totalProfit / this.duration;
//         //       } else if (this.durationType === 'days') {
//         //         subscriber.interestCounter.perDay = (subscriber.interestCounter.perDay || 0) + this.totalProfit / this.duration;
//         //       }
//         //     }
//         //   });
//         // } else {
//         //   console.error('Invalid subscribers array:', this.subscribers);
//         // }
  
//         this.total = this.totalProfit + this.amount;
//       } else {
//         console.error('Invalid durationType:', this.durationType);
//       }
  
//       // Update isApproved based on DepositProof status
//       for (const subscriber of this.subscribers) {
//         const depositProofId = subscriber.paymentInfo.depositProof;
  
//         if (depositProofId) {
//           try {
//             const depositProof = await mongoose.model('DepositProof').findById(depositProofId);
  
//             if (depositProof && depositProof.approved) {
//               subscriber.paymentInfo.isApproved.status = 'approved';
//             }
//           } catch (error) {
//             console.error('Error checking DepositProof status:', error);
//             // Handle the error gracefully based on your application's requirements
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error updating counters:', error);
//     }
  
//     next();
//   });
  

//   // InvestmentPlanSchema.pre('save', async function (next) {
//   //   try {
//   //     if (this.durationType === 'hours' || this.durationType === 'days') {
//   //       this.totalProfit = (this.amount * this.interestPercentage * this.duration) / 100;
  
//   //       if (this.subscribers && Array.isArray(this.subscribers)) {
//   //         this.subscribers.forEach(subscriber => {
//   //           if (!subscriber.interestCounter) {
//   //             subscriber.interestCounter = {};
//   //           }
  
//   //           if (this.durationType === 'hours') {
//   //             subscriber.interestCounter.perHour = (subscriber.interestCounter.perHour || 0) + this.totalProfit / this.duration;
//   //           } else if (this.durationType === 'days') {
//   //             subscriber.interestCounter.perDay = (subscriber.interestCounter.perDay || 0) + this.totalProfit / this.duration;
//   //           }
//   //         });
//   //       } else {
//   //         console.error('Invalid subscribers array:', this.subscribers);
//   //       }
  
//   //       this.total = this.totalProfit + this.amount;
//   //     } else {
//   //       console.error('Invalid durationType:', this.durationType);
//   //     }
  
//   //     // Update isApproved based on DepositProof status
//   //     for (const subscriber of this.subscribers) {
//   //       const depositProofId = subscriber.paymentInfo.depositProof;
  
//   //       if (depositProofId) {
//   //         try {
//   //           const depositProof = await mongoose.model('DepositProof').findById(depositProofId);
  
//   //           if (depositProof && depositProof.approved) {
//   //             subscriber.paymentInfo.isApproved.status = 'approved';
//   //           }
//   //         } catch (error) {
//   //           console.error('Error checking DepositProof status:', error);
//   //           // Handle the error gracefully based on your application's requirements
//   //         }
//   //       }
//   //     }
  
//   //   } catch (error) {
//   //     console.error('Error updating counters:', error);
//   //   }
  
//   //   next();
//   // });
  
  
  
  

// const InvestmentPlan = mongoose.model('InvestmentPlan', InvestmentPlanSchema);

// module.exports = InvestmentPlan;

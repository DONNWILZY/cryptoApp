const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        //required: true
    },
    country: {
        type: String
        // You can add further validations or requirements as needed
    },
    city: {
        type: String
        // You can add further validations or requirements as needed
    },
    wallet: {
        balance: {
            type: Number,
            default: 0
        },
        investment: {
            type: Number,
            default: 0
        },
        interest: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
        // You can include additional wallet properties like transaction history, etc.
    },
   
    role: {
        type: String,
        enum: ['isAdmin', 'isUser'],
        default: 'isUser'
    },
    activeStatus: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String
        // You can add further validations or requirements as needed
    },
    dob: {
        type: Date
        // You can add further validations or requirements as needed
    },
      // Reference to subscribed investment plans (array of ObjectIds)
      subscribedPlans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InvestmentPlan'
    }],

    // Reference to multiple deposit proofs submitted by the user (array of ObjectIds)
    depositProofs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DepositProof'
    }]
});

// Pre-save hook to calculate the total wallet value
UserSchema.pre('save', function (next) {
    // Calculate the total value by summing up all wallet fields
    this.wallet.total = this.wallet.balance + this.wallet.investment + this.wallet.interest;
    next();
  });

const User = mongoose.model('User', UserSchema);

module.exports = User;

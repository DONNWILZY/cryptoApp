const mongoose = require('mongoose');

const InvestmentPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model
    },
    planName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    interestPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    duration: {
        type: Number,
        required: true,
    },
    durationType: {
        type: String,
        enum: ['hours', 'days'],
       // required: true
    },
    totalProfit: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        //required: true
    },
    
    depositProofs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DepositProof'
    }],
    
});

InvestmentPlanSchema.pre('save', function (next) {
    if (this.durationType === 'hours') {
        this.totalProfit = (this.amount * this.interestPercentage * (this.duration / 24)) / 100;
    } else if (this.durationType === 'days') {
        this.totalProfit = (this.amount * this.interestPercentage * this.duration) / 100;
    }

    this.total = this.totalProfit + this.amount;
    next();
});

const InvestmentPlan = mongoose.model('InvestmentPlan', InvestmentPlanSchema);

module.exports = InvestmentPlan;

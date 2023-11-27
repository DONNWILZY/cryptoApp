const mongoose = require('mongoose');

const CoinPaySchema = new mongoose.Schema({
    coinId: {
        type: String,
        required: true,
        unique: true
    },
    coinSymbol: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: Number,
        //required: true
    },
    coinName: {
        type: Date,
        default: Date.now
    }
});

const CoinPay = mongoose.model('CoinPay', CoinPaySchema);
module.exports = CoinPay;

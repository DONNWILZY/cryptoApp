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
        type: String,
        //required: true
    },
    coinName: {
        type: String,
       
    }
});

const CoinPay = mongoose.model('CoinPay', CoinPaySchema);
module.exports = CoinPay;

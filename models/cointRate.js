const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
    coinName: {
        type: String,
        required: true,
        unique: true
    },
    coinSymbol: {
        type: String,
        required: true,
        unique: true
    },
    exchangeRate: {
        type: Number,
        //required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const Coin = mongoose.model('Coin', CoinSchema);
module.exports = Coin;

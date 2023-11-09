// Assuming your Express server is set up in app.js or index.js
const express = require('express');
const router = express.Router();
const { addCoinS, getAllCoins, getCoinBySymbol, getCoinById, addCoinPrice, updateCoinPrice } = require('../controllers/CointRateController');

router.post('/add', addCoinS);
router.post('/addcoin', addCoinPrice);
router.get('/coins', getAllCoins);
router.get('/coins/:symbol', getCoinBySymbol);
router.get('/coin/:id', getCoinById);
router.post('/updateprice', async (req, res) => {
    const { coinSymbol } = req.body;

    try {
        if (!coinSymbol) {
            return res.status(400).json({ message: 'Please provide a coin symbol' });
        }

        // Call the updateCoinPrice function to update the coin's price in the database
        await updateCoinPrice(coinSymbol);

        res.status(200).json({ message: `Coin ${coinSymbol} price updated successfully` });
    } catch (error) {
        console.error('Error updating coin price:', error);
        res.status(500).json({ message: 'Failed to update coin price' });
    }
});

module.exports = router; //addCoinPrice

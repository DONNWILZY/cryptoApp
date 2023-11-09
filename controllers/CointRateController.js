// coinController.js
const Coin = require('../models/cointRate');
const axios = require('axios')

const addCoinS = async (req, res) => {
  const { coinName, coinSymbol, exchangeRate } = req.body;

  try {
    // Check if the coin with the given symbol already exists
    const existingCoin = await Coin.findOne({ coinSymbol });
    if (existingCoin) {
      return res.status(400).json({ message: 'Coin with this symbol already exists' });
    }

    // Create a new coin and save it to the database
    const newCoin = new Coin({ coinName, coinSymbol, exchangeRate });
    await newCoin.save();

    res.status(201).json({ message: 'Coin added successfully', data: newCoin });
  } catch (error) {
    console.error('Error adding coin:', error);
    res.status(500).json({ message: 'Failed to add the coin' });
  }
};

const getAllCoins = async (req, res) => {
    try {
      const coins = await Coin.find();
      res.status(200).json({ coins });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };


  const getCoinById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const coin = await Coin.findById(id);
      if (!coin) {
        return res.status(404).json({ message: 'Coin not found' });
      }
      res.status(200).json({ coin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  // coinController.js

const getCoinBySymbol = async (req, res) => {
    const { symbol } = req.params;
  
    try {
      const coin = await Coin.findOne({ coinSymbol: symbol });
      if (!coin) {
        return res.status(404).json({ message: 'Coin not found' });
      }
      res.status(200).json({ coin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };




const addCoinPrice = async (req, res) => {
  const { coinName, coinSymbol, exchangeRate } = req.body;

  try {
    // Check if the coin with the given symbol already exists
    const existingCoin = await Coin.findOne({ coinSymbol });

    if (existingCoin) {
      return res.status(400).json({ message: 'Coin with this symbol already exists' });
    }

    // Create a new coin and save it to the database
    const newCoin = new Coin({ coinName, coinSymbol, exchangeRate });
    await newCoin.save();

    res.status(201).json({ message: 'Coin added successfully', data: newCoin });
  } catch (error) {
    console.error('Error adding coin:', error);
    res.status(500).json({ message: 'Failed to add the coin' });
  }
};

// Function to update coin price in the database
const updateCoinPrice = async (coinSymbol) => {
  try {
    let coinUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d';
    // Fetch data for the given coin symbol from the API
    const response = await axios.get(`${coinUrl}/${coinSymbol}`);

    // Extract the current price from the API response
    const currentPrice = response.data.current_price;

    // Find the coin in the database using the symbol
    const coinToUpdate = await Coin.findOne({ coinSymbol });

    if (coinToUpdate) {
      // If the coin is found, update its exchange rate and last updated time
      coinToUpdate.exchangeRate = currentPrice;
      coinToUpdate.lastUpdated = new Date();

      // Save the updated coin in the database
      await coinToUpdate.save();
      console.log(`Coin ${coinSymbol} updated successfully.`);
    }
  } catch (error) {
    console.error(`Error updating coin ${coinSymbol} price:`, error);
  }
};

// Periodically update coin prices (e.g., every 5 minutes)
setInterval(async () => {
  // Update the price for a specific coin symbol, e.g., 'eth' (Ethereum)
  await updateCoinPrice('eth');
}, 5 * 60 * 1000); // 5 minutes in milliseconds



  
 
  

module.exports = { addCoinS,addCoinPrice, getAllCoins, getCoinById, getCoinBySymbol, updateCoinPrice  };

const CoinPay = require('../models/coinPay');

// Create
const createCoinPay = async (req, res) => {
  try {
    const coinPay = await CoinPay.create(req.body);
    res.status(201).json(coinPay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read All
const getAllCoinPays = async (req, res) => {
  try {
    const coinPays = await CoinPay.find();
    res.status(200).json(coinPays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Single
const getCoinPayById = async (req, res) => {
  try {
    const coinPay = await CoinPay.findById(req.params.id);
    if (!coinPay) {
      return res.status(404).json({ message: 'CoinPay not found' });
    }
    res.status(200).json(coinPay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
const updateCoinPay = async (req, res) => {
  try {
    const coinPay = await CoinPay.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!coinPay) {
      return res.status(404).json({ message: 'CoinPay not found' });
    }
    res.status(200).json(coinPay);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete
const deleteCoinPay = async (req, res) => {
  try {
    const coinPay = await CoinPay.findByIdAndRemove(req.params.id);
    if (!coinPay) {
      return res.status(404).json({ message: 'CoinPay not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCoinPay,
  getAllCoinPays,
  getCoinPayById,
  updateCoinPay,
  deleteCoinPay,
};

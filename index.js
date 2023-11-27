const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cacheManager = require('cache-manager');
// Import the scheduler
 require('./utilities/scheduler');


/// apply cors
app.use(cors());

// Middleware
app.use(express.json());

// Load environment variables
dotenv.config();

// Import routes
const authRoute = require('./routes/auth');
const coiRateRoute = require('./routes/coinRate');
const planRoute = require('./routes/planRoute');
const viewDepositforInvestment = require('./routes/viewPaymentproofForInvestmentRoute');
const swapRoute = require('./routes/swapRoute');
const reversalRoute = require('./routes/reversalroute');
const sellRoute = require('./routes/sellRout');
const userroute = require('./routes/userRoute');
const proofRoute = require('./routes/proofRoute');
const coinPayRoute = require('./routes/coinpayRoute');

// Routes middlewares
app.use('/api/auth', authRoute);
app.use('/api/coinRate', coiRateRoute);
app.use('/api/plan', planRoute);
app.use('/api/View', viewDepositforInvestment);
app.use('/api/swap', swapRoute);
app.use('/api/reverse', reversalRoute);
app.use('/api/sell', sellRoute);
app.use('/api/user', userroute);
app.use('/api/proof', proofRoute);
app.use('/api/account', coinPayRoute);






app.get('/currentPrice', async (req, res) => {
    try {
      // Make an HTTP GET request to the API endpoint.
      let urlapi  = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd';
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
  
      // Parse the JSON response into a JavaScript object.
      const data = response.data;
  
      // Assuming that the response is an array of objects, you can access the current price of the first item in the array like this:
      const currentPrice = data[0].current_price;
  
      // Send the current price as the response.
      res.json({ currentPrice });
    } catch (error) {
      // Handle any errors that may occur during the request.
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch current price' });
    }
  });


  

// Define a route to fetch specific data for "Bitcoin."
app.get('/bitcoinData', async (req, res) => {
    try {
      // Make an HTTP GET request to the API endpoint.
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
  
      // Parse the JSON response into a JavaScript array.
      const data = response.data;
  
      // Find the "Bitcoin" cryptocurrency in the response.
      const bitcoinData = data.find(coin => coin.id === 'bitcoin');
  
      if (bitcoinData) {
        // Extract the specific data for "Bitcoin."
        const { id, symbol, name, current_price } = bitcoinData;
  
        // Send the extracted data as the response.
        res.json({ id, symbol, name, current_price });
      } else {
        // If "Bitcoin" is not found in the response, send an error message.
        res.status(404).json({ error: 'Bitcoin data not found' });
      }
    } catch (error) {
      // Handle any errors that may occur during the request.
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch Bitcoin data' });
    }
  });


  // Define a route to fetch specific data for a cryptocurrency by its symbol.
app.get('/cryptoData/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toLowerCase(); // Convert the symbol to lowercase for case-insensitivity
  
    try {
      // Make an HTTP GET request to the API endpoint.
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
  
      // Parse the JSON response into a JavaScript array.
      const data = response.data;
  
      // Find the cryptocurrency based on the provided symbol.
      const cryptoData = data.find(coin => coin.symbol.toLowerCase() === symbol);
  
      if (cryptoData) {
        // Extract the specific data for the cryptocurrency.
        const { id, symbol, name, current_price } = cryptoData;
  
        // Send the extracted data as the response.
        res.json({ id, symbol, name, current_price });
      } else {
        // If the cryptocurrency is not found, send an error message.
        res.status(404).json({ error: 'Cryptocurrency data not found' });
      }
    } catch (error) {
      // Handle any errors that may occur during the request.
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch cryptocurrency data' });
    }
  });
  
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

// Environment Variables
const PORT = process.env.PORT || 3000;
const currencyUrl = `${process.env.currencyUrl}:${PORT}`;

// Database connection URL
const cloudDB = process.env.databaseUrl;
const localDB = process.env.MONGODB_URI;
const dataB =      cloudDB   ||  localDB;

// Routes
app.get('/', (req, res) => {
    res.send('I AM CRYPTO APP');
});

// Database connection
mongoose.connect(dataB, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

// Database event handlers
db.on('error', (error) => {
    console.error('Connection error:', error);
});

db.once('open', () => {
    console.log('Connection to MongoDB successful!');
});

db.once('close', () => {
    console.log('Connection to MongoDB disconnected.');
});

// Route for displaying connection information
app.get('/info', (req, res) => {
    res.send(`I am here at ${currencyUrl} & DB: ${dataB}`);
});

// Server initialization
app.listen(5000, () => {
    console.log(`Connected to PORT: ${PORT} using ${currencyUrl}`);
});

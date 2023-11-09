const cron = require('node-cron');
const updateProfitAndMoveToWallet = require('../middleWare/updateProfit');

// Schedule to run every 5 minutes
cron.schedule('*/1` * * * *', async () => {
  console.log('Running the updateProfitAndMoveToWallet function...');
  await updateProfitAndMoveToWallet();
});

const cron = require('node-cron');
const {updateProfitAndMoveToWallet} = require('../cron/updateProfit')


// Schedule to run every minute
cron.schedule('*/1 * * * *', async () => {
  console.log('Running interest Counter');
  await updateProfitAndMoveToWallet();
});

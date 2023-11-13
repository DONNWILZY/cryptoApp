const cron = require('node-cron');


// Schedule to run every minute
cron.schedule('*/1 * * * *', async () => {
  console.log('Running interest Counter');
  await updateProfitAndMoveToWallet();
});

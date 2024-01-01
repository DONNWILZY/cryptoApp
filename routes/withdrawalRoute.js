const express = require('express');
const router = express.Router();
const { withdraw, updateWithdrawal, getAllWithdrawals, getWithdrawalById, getUserWithdrawals, deleteWithdrawal } = require('../controllers/withdrawController');

// Endpoint for handling withdrawals
router.post('/withdraw', withdraw);

// Route to update withdrawal status
router.put('/update', updateWithdrawal);

router.get('/withdrawals', getAllWithdrawals);
router.get('/view/:withdrawalId', getWithdrawalById);
router.get('/user/:userId', getUserWithdrawals);
router.delete('/delete/:withdrawalId', deleteWithdrawal);

module.exports = router;

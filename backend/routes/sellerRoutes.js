const express = require('express');
const router = express.Router();
const {
    getMyProducts,
    getSellerOverview,
    getMonthlyRevenue,
    getWithdrawRequests,
    createWithdrawRequest,
} = require('../controllers/sellerController');
const { protect, seller } = require('../middlewares/authMiddleware');

router.get('/products', protect, seller, getMyProducts);
router.get('/overview', protect, seller, getSellerOverview);
router.get('/stats/monthly', protect, seller, getMonthlyRevenue);
router.get('/withdrawals', protect, seller, getWithdrawRequests);
router.post('/withdrawals', protect, seller, createWithdrawRequest);

module.exports = router;

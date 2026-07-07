const express = require('express');
const router = express.Router();
const {
    getMyProducts,
    getSellerOverview,
    getMonthlyRevenue,
} = require('./sellerController');
const { protect, seller } = require('../middlewares/authMiddleware');

router.get('/products', protect, seller, getMyProducts);
router.get('/overview', protect, seller, getSellerOverview);
router.get('/stats/monthly', protect, seller, getMonthlyRevenue);

module.exports = router;

const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getSellerStats } = require('../controllers/orderController');
const { protect,seller } = require('../middlewares/authMiddleware');


// API tạo đơn hàng
router.post('/', protect, addOrderItems);

// Route tạo đơn & xem đơn
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

// API lấy kho tải xuống của user
router.get('/myorders', protect, getMyOrders);

// Route xem thống kê của Seller
router.get('/seller-stats', protect, seller, getSellerStats);

module.exports = router;
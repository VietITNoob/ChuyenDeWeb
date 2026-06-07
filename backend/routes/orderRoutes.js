const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// API tạo đơn hàng
router.post('/', protect, addOrderItems);

// API lấy kho tải xuống của user
router.get('/myorders', protect, getMyOrders);

module.exports = router;
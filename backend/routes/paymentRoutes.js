const express = require('express');
const router = express.Router();
const { createPaymentUrl, vnpayReturn } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Route tạo URL thanh toán (Cần đăng nhập)
router.post('/create_payment_url', protect, createPaymentUrl);

// Route xử lý kết quả VNPAY (Public để VNPAY có thể redirect/gọi về)
router.get('/vnpay_return', vnpayReturn);

module.exports = router;
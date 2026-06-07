const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, getUnapprovedProducts, approveProduct } = require('../controllers/productController');
const { protect, seller, admin } = require('../middlewares/authMiddleware');


router.get('/', getProducts);
router.post('/', protect, seller, createProduct);

// PHẢI đặt trước /:id để /unapproved không bị match vào /:id
router.get('/unapproved', protect, admin, getUnapprovedProducts);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductById);

// Duyệt sản phẩm (Admin only)
router.put('/:id/approve', protect, admin, approveProduct);

module.exports = router;
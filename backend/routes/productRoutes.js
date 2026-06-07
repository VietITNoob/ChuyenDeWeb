const express = require('express');
const router = express.Router();
const { getProducts, createProduct, getUnapprovedProducts, approveProduct } = require('../controllers/productController');
const { protect, seller,admin } = require('../middlewares/authMiddleware');


router.get('/', getProducts);
router.post('/', protect, seller, createProduct);

router.get('/unapproved', protect, admin, getUnapprovedProducts);

router.route('/')
    .get(getProducts)
    .post(protect, seller, createProduct);

// Route duyệt sản phẩm (Phải là Admin)
router.put('/:id/approve', protect, admin, approveProduct);
module.exports = router;
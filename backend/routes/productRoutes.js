const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { protect, seller } = require('../middlewares/authMiddleware');


router.get('/', getProducts);


router.post('/', protect, seller, createProduct);

module.exports = router;
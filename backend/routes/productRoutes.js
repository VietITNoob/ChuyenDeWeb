const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProducts, getProductById, createProduct, getUnapprovedProducts, approveProduct } = require('../controllers/productController');
const { protect, seller, admin } = require('../middlewares/authMiddleware');
const { handleValidationErrors } = require('../middlewares/validate');

// ===== VALIDATION RULES cho tạo sản phẩm =====
const createProductValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Tên sản phẩm không được để trống.')
        .isLength({ min: 5, max: 100 }).withMessage('Tên sản phẩm phải từ 5 đến 100 ký tự.'),

    body('description')
        .trim()
        .notEmpty().withMessage('Mô tả sản phẩm không được để trống.')
        .isLength({ min: 20 }).withMessage('Mô tả phải có ít nhất 20 ký tự.'),

    body('price')
        .notEmpty().withMessage('Giá sản phẩm không được để trống.')
        .isFloat({ min: 0 }).withMessage('Giá phải là số và không được âm.'),

    body('language')
        .trim()
        .notEmpty().withMessage('Ngôn ngữ lập trình không được để trống.'),

    body('platform')
        .trim()
        .notEmpty().withMessage('Nền tảng (platform) không được để trống.')
        .isIn(['Web', 'Mobile', 'UI', 'Desktop', 'Other'])
        .withMessage('Platform không hợp lệ.'),

    body('image')
        .trim()
        .notEmpty().withMessage('Ảnh sản phẩm không được để trống.')
        .isURL().withMessage('Ảnh sản phẩm phải là URL hợp lệ.'),

    body('sourceCodeFile')
        .trim()
        .notEmpty().withMessage('File source code không được để trống.')
        .isURL().withMessage('Source code file phải là URL hợp lệ.'),
];

// ===== ROUTES =====
router.get('/', getProducts);
router.post('/', protect, seller, createProductValidation, handleValidationErrors, createProduct);

// PHẢI đặt trước /:id để /unapproved không bị match vào /:id
router.get('/unapproved', protect, admin, getUnapprovedProducts);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductById);

// Duyệt sản phẩm (Admin only)
router.put('/:id/approve', protect, admin, approveProduct);

module.exports = router;
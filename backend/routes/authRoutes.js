const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');
const { handleValidationErrors } = require('../middlewares/validate');

// ===== BẢO MẬT: Rate Limit riêng cho Login (chống Brute-force) =====
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 10,                   // Tối đa 10 lần thử đăng nhập mỗi IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.' }
});

// ===== VALIDATION RULES =====
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Họ tên không được để trống.')
        .isLength({ min: 2, max: 50 }).withMessage('Họ tên phải từ 2 đến 50 ký tự.'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email không được để trống.')
        .isEmail().withMessage('Email không đúng định dạng.')
        .normalizeEmail(), // Tự động chuẩn hóa email (chống bypass)

    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống.')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự.')
        .matches(/\d/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ số.'),

    body('role')
        .optional()
        .isIn(['buyer', 'seller']).withMessage('Role không hợp lệ. Chỉ chấp nhận: buyer, seller.'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email không được để trống.')
        .isEmail().withMessage('Email không đúng định dạng.'),

    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống.'),
];

// ===== ROUTES =====
router.post('/register', registerValidation, handleValidationErrors, registerUser);
router.post('/login', loginLimiter, loginValidation, handleValidationErrors, loginUser);

module.exports = router;
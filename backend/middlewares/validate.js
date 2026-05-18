const { validationResult } = require('express-validator');

/**
 * Middleware xử lý kết quả validation từ express-validator.
 * Đặt sau các validation rules trong route để tự động trả lỗi 422.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Lấy lỗi đầu tiên để hiển thị thông báo rõ ràng
        const firstError = errors.array()[0];
        return res.status(422).json({
            message: firstError.msg,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
            }))
        });
    }
    next();
};

module.exports = { handleValidationErrors };

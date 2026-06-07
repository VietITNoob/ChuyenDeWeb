const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs'); // Thư viện có sẵn của Node.js để thao tác với file
const router = express.Router();
const { protect, seller } = require('../middlewares/authMiddleware');

// 1. Cấu hình Cloudinary lấy dữ liệu từ file .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình Multer: Lưu file tạm thời vào thư mục 'uploads/'
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        // Đặt tên file = thời gian hiện tại + tên gốc (tránh trùng lặp)
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// 3. API Upload (Hỗ trợ cả ảnh và file ZIP)
// @route   POST /api/upload
// @access  Private/Seller
router.post('/', protect, seller, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Không có file nào được tải lên' });
        }

        // Cloudinary tự nhận diện loại file qua resource_type: 'auto'
        // (Ảnh sẽ là 'image', file .zip sẽ được phân loại là 'raw')
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto',
            folder: 'codestore', // Tạo một thư mục con trên Cloudinary cho gọn
        });

        // Sau khi upload thành công lên mây, xóa file tạm ở server Node.js cho nhẹ máy
        fs.unlinkSync(req.file.path);

        // Trả về đường link an toàn
        res.status(200).json({
            message: 'Upload thành công',
            url: result.secure_url
        });
    } catch (error) {
        console.error(error);
        // Nếu lỗi xảy ra, cũng phải xóa file tạm để tránh rác server
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ message: 'Lỗi khi upload file lên server Cloudinary' });
    }
});

module.exports = router;
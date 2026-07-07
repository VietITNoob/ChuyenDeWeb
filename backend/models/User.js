const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: function() {
            // Yêu cầu password nếu KHÔNG có googleId
            return !this.googleId;
        } 
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer'
    },
    isBlocked: { type: Boolean, required: true, default: false },
    googleId: { type: String, sparse: true },   // Google OAuth ID
    avatar: { type: String },                    // Ảnh đại diện từ Google
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
}, { timestamps: true });

// Middleware: Tự động mã hóa mật khẩu trước khi lưu (save) vào DB
userSchema.pre('save', async function () {
    // Chỉ hash khi password thay đổi và tồn tại (Google user không có password)
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Hàm hỗ trợ: Kiểm tra mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

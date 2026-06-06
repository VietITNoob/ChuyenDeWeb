const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer'
    }
}, { timestamps: true });

// Middleware: Tự động mã hóa mật khẩu trước khi lưu (save) vào DB
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return ;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

});

// Hàm hỗ trợ: Kiểm tra mật khẩu khi đăng nhập
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
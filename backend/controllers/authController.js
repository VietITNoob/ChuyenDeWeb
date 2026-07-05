const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendResetPasswordEmail } = require('../utils/emailService');

// Google OAuth2 Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        // Tạo user mới (mật khẩu sẽ tự động được băm nhờ middleware trong User.js)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'buyer' // Mặc định là người mua nếu không truyền lên
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu người dùng không hợp lệ' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Xác thực user & lấy token (Đăng nhập)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm user theo email
        const user = await User.findOne({ email });

        // Kiểm tra user có tồn tại và mật khẩu có khớp không
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Gửi email reset password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Không tiết lộ email có tồn tại hay không (bảo mật)
            return res.json({ message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được link đặt lại mật khẩu.' });
        }

        // Tạo token ngẫu nhiên (plain text gửi cho user)
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token trước khi lưu vào DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút
        await user.save({ validateBeforeSave: false });

        // URL gửi cho user chứa plain token
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        try {
            await sendResetPasswordEmail(user.email, resetUrl);
            res.json({ message: 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.' });
        } catch (emailError) {
            // Nếu gửi email thất bại → xóa token để tránh token vô dụng còn trong DB
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            console.error('Lỗi gửi email:', emailError.message);
            res.status(500).json({ message: 'Không thể gửi email. Vui lòng thử lại sau.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Đặt lại mật khẩu bằng token
// @route   PUT /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;

        // Hash token từ URL để so sánh với DB
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // Tìm user có token khớp và chưa hết hạn
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }

        // Cập nhật mật khẩu mới (middleware pre-save sẽ tự hash)
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Đăng nhập / Đăng ký bằng Google OAuth
// @route   POST /api/auth/google
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: 'Google credential không được để trống.' });
        }

        // Verify Google ID Token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ message: 'Google token không hợp lệ.' });
        }

        const { sub: googleId, email, name, picture } = payload;

        // Tìm user theo googleId trước, sau đó theo email
        let user = await User.findOne({ googleId });

        if (!user) {
            // Kiểm tra email đã có tài khoản email/password chưa
            user = await User.findOne({ email });

            if (user) {
                // Liên kết Google vào tài khoản đã có
                user.googleId = googleId;
                user.avatar = user.avatar || picture;
                await user.save({ validateBeforeSave: false });
            } else {
                // Tạo tài khoản mới từ Google
                user = await User.create({
                    name,
                    email,
                    googleId,
                    avatar: picture,
                    // Không set password (Google user không cần)
                    role: 'buyer',
                });
            }
        }

        // Trả về JWT giống như đăng nhập thường
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Google Login Error:', error.message);
        res.status(500).json({ message: 'Đăng nhập Google thất bại. Vui lòng thử lại.' });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, googleLogin };

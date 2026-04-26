const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const voucherRoutes = require('./routes/voucherRoutes');

dotenv.config();
connectDB();

const app = express();

// ===== BẢO MẬT: HTTP Security Headers =====
app.use(helmet());

// ===== BẢO MẬT: Giới hạn request chung (chống DDoS) =====
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 200,                  // Tối đa 200 request mỗi IP trong 15 phút
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 15 phút.' }
});
app.use(generalLimiter);

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Giới hạn body size


// Sử dụng Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/vouchers', voucherRoutes);

app.get('/', (req, res) => {
    res.send('CodeStore Backend API is running...');
});

app.get('/api/health/routes', (req, res) => {
    res.json({
        message: 'Dashboard routes are mounted',
        admin: [
            'GET /api/admin/reviews',
            'PATCH /api/admin/users/:id/block',
            'PATCH /api/admin/products/:id/lock',
        ],
        vouchers: [
            'PATCH /api/vouchers/:id/approve',
            'PATCH /api/vouchers/:id/reject',
            'PATCH /api/vouchers/:id/toggle',
        ],
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

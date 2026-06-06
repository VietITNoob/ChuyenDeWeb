const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Tải các biến từ file .env
dotenv.config();

// Kết nối cơ sở dữ liệu
connectDB();

const app = express();

// Middlewares cơ bản
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Cho phép server đọc dữ liệu JSON gửi từ Client

// Route test cơ bản
app.get('/', (req, res) => {
    res.send('CodeStore Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
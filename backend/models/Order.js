const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Khách hàng tạo đơn
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },

    // Danh sách source code trong đơn hàng
    orderItems: [
        {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        }
    ],

    // Thông tin thanh toán
    paymentMethod: { type: String, required: true, default: 'VNPAY' }, // Sẽ mở rộng VNPAY ở bước sau
    paymentResult: {
        id: { type: String }, // Mã giao dịch từ VNPAY
        status: { type: String },
        update_time: { type: String }
    },

    // Tổng tiền
    totalPrice: { type: Number, required: true, default: 0.0 },

    // Trạng thái đơn hàng (Rất quan trọng để mở khóa tính năng tải file)
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
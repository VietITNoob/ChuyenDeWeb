const Order = require('../models/Order');

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private (Chỉ user đã đăng nhập mới được tạo)
const addOrderItems = async (req, res) => {
    try {
        const { orderItems, paymentMethod, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        } else {
            const order = new Order({
                user: req.user._id, // Lấy ID từ token đăng nhập
                orderItems,
                paymentMethod,
                totalPrice
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lấy danh sách các đơn hàng đã mua của User (Kho tải xuống)
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        // Tìm các đơn hàng thuộc về user này và ĐÃ THANH TOÁN
        const orders = await Order.find({ user: req.user._id, isPaid: true })
            .populate('orderItems.product', 'sourceCodeFile');
        // Lấy thêm đường dẫn file zip từ bảng Product để user tải
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addOrderItems, getMyOrders };
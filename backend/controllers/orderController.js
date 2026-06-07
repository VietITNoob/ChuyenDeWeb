const Order = require('../models/Order');
const Product = require('../models/Product');


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


const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({ user: req.user._id, isPaid: true })
            .populate('orderItems.product', 'sourceCodeFile');
        // Lấy thêm đường dẫn file zip từ bảng Product để user tải
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getSellerStats = async (req, res) => {
    try {

        const paidOrders = await Order.find({ isPaid: true }).populate('orderItems.product');

        let totalRevenue = 0;
        let totalSold = 0;
        let soldItemsDetails = [];


        paidOrders.forEach(order => {
            order.orderItems.forEach(item => {

                if (item.product && item.product.seller.toString() === req.user._id.toString()) {
                    totalRevenue += item.price;
                    totalSold += 1;
                    soldItemsDetails.push({
                        orderId: order._id,
                        productName: item.title,
                        price: item.price,
                        date: order.paidAt
                    });
                }
            });
        });

        res.json({
            totalSold,
            totalRevenue,
            details: soldItemsDetails
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { addOrderItems, getMyOrders,getSellerStats };
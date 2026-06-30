const Product = require('../models/Product');
const Order = require('../models/Order');
const Voucher = require('../models/Voucher');
const User = require('../models/User');
const WithdrawRequest = require('../models/WithdrawRequest');

const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id })
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSellerOverview = async (req, res) => {
    try {
        const [products, vouchers, paidOrders] = await Promise.all([
            Product.find({ seller: req.user._id }),
            Voucher.find({ seller: req.user._id }),
            Order.find({ isPaid: true }).populate('orderItems.product', 'seller'),
        ]);

        let totalRevenue = 0;
        let totalSold = 0;

        paidOrders.forEach((order) => {
            order.orderItems.forEach((item) => {
                if (item.product && item.product.seller && item.product.seller.toString() === req.user._id.toString()) {
                    totalRevenue += item.price * (item.quantity || 1);
                    totalSold += item.quantity || 1;
                }
            });
        });

        res.json({
            totalProducts: products.length,
            approvedProducts: products.filter((product) => product.isApproved).length,
            pendingProducts: products.filter((product) => !product.isApproved && !product.rejectionReason).length,
            rejectedProducts: products.filter((product) => product.rejectionReason).length,
            totalVouchers: vouchers.length,
            activeVouchers: vouchers.filter((voucher) => voucher.isActive).length,
            totalRevenue,
            totalSold,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMonthlyRevenue = async (req, res) => {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);
        const months = Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            revenue: 0,
            sold: 0,
        }));

        const orders = await Order.find({
            isPaid: true,
            paidAt: { $gte: start, $lt: end },
        }).populate('orderItems.product', 'seller');

        orders.forEach((order) => {
            const monthIndex = new Date(order.paidAt).getMonth();

            order.orderItems.forEach((item) => {
                if (item.product && item.product.seller && item.product.seller.toString() === req.user._id.toString()) {
                    months[monthIndex].revenue += item.price * (item.quantity || 1);
                    months[monthIndex].sold += item.quantity || 1;
                }
            });
        });

        res.json({ year, months });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWithdrawRequests = async (req, res) => {
    try {
        const requests = await WithdrawRequest.find({ seller: req.user._id })
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createWithdrawRequest = async (req, res) => {
    try {
        const { amount, bankName, accountNumber, accountName } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Số tiền rút không hợp lệ.' });
        }

        if (!bankName || !accountNumber || !accountName) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin tài khoản ngân hàng.' });
        }

        const user = await User.findById(req.user._id);

        if (user.balance < amount) {
            return res.status(400).json({ message: 'Số dư khả dụng không đủ để thực hiện yêu cầu này.' });
        }

        // Trừ số dư của người bán ngay lập tức khi tạo yêu cầu
        user.balance -= amount;
        await user.save();

        const withdrawRequest = new WithdrawRequest({
            seller: req.user._id,
            amount,
            bankName,
            accountNumber,
            accountName,
            status: 'pending',
        });

        await withdrawRequest.save();

        res.status(201).json({ message: 'Yêu cầu rút tiền đã được gửi thành công.', withdrawRequest, newBalance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyProducts,
    getSellerOverview,
    getMonthlyRevenue,
    getWithdrawRequests,
    createWithdrawRequest,
};

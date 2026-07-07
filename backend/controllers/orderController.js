const Order = require('../models/Order');
const Product = require('../models/Product');
const Voucher = require('../models/Voucher');

const addOrderItems = async (req, res) => {
    try {
        if (req.user.role !== 'buyer') {
            return res.status(403).json({ message: 'Chi tai khoan nguoi mua moi duoc thanh toan.' });
        }

        const { orderItems, paymentMethod, voucherCode } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'Gio hang trong.' });
        }

        const productIds = orderItems.map((item) => item.product);
        const products = await Product.find({
            _id: { $in: productIds },
            isApproved: true,
            isLocked: { $ne: true },
        });

        if (products.length !== productIds.length) {
            return res.status(400).json({ message: 'Gio hang co san pham khong hop le hoac dang bi khoa.' });
        }

        const productMap = new Map(products.map((product) => [product._id.toString(), product]));
        const normalizedItems = orderItems.map((item) => {
            const product = productMap.get(String(item.product));
            return {
                title: product.title,
                price: product.price,
                quantity: Number(item.quantity) || 1,
                product: product._id,
            };
        });

        const subTotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let discountAmount = 0;
        let voucher = null;

        if (voucherCode) {
            voucher = await Voucher.findOne({
                code: String(voucherCode).trim().toUpperCase(),
                isActive: true,
                status: 'approved',
                startDate: { $lte: new Date() },
                endDate: { $gte: new Date() },
            });

            if (!voucher || voucher.usedCount >= voucher.usageLimit) {
                return res.status(400).json({ message: 'Voucher khong hop le, chua duoc duyet hoac da het luot.' });
            }

            const applicableSet = new Set(voucher.applicableProducts.map((id) => id.toString()));
                const applicableTotal = normalizedItems
                    .filter((item) => applicableSet.has(item.product.toString()))
                    .reduce((sum, item) => sum + item.price * item.quantity, 0);

            if (applicableTotal <= 0) {
                return res.status(400).json({ message: 'Voucher khong ap dung cho san pham trong gio hang.' });
            }

            discountAmount = voucher.discountType === 'percent'
                ? Math.round(applicableTotal * voucher.discountValue / 100)
                : Math.min(voucher.discountValue, applicableTotal);
        }

        const order = new Order({
            user: req.user._id,
            orderItems: normalizedItems,
            paymentMethod,
            voucher: voucher?._id,
            voucherCode: voucher?.code,
            discountAmount,
            totalPrice: Math.max(subTotal - discountAmount, 0),
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('orderItems.product', 'sourceCodeFile');

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
        const soldItemsDetails = [];

        paidOrders.forEach((order) => {
            order.orderItems.forEach((item) => {
                if (item.product && item.product.seller.toString() === req.user._id.toString()) {
                    totalRevenue += item.price * (item.quantity || 1);
                    totalSold += item.quantity || 1;
                    soldItemsDetails.push({
                        orderId: order._id,
                        productName: item.title,
                        price: item.price,
                        date: order.paidAt,
                    });
                }
            });
        });

        res.json({
            totalSold,
            totalRevenue,
            details: soldItemsDetails,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addOrderItems, getMyOrders, getSellerStats };

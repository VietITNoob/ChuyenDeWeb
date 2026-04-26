const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Voucher = require('../models/Voucher');
const WithdrawRequest = require('../models/WithdrawRequest');

const getOverview = async (req, res) => {
    try {
        const [users, products, vouchers, paidOrders] = await Promise.all([
            User.find({}),
            Product.find({}),
            Voucher.find({}),
            Order.find({ isPaid: true }),
        ]);

        const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        res.json({
            totalUsers: users.length,
            totalBuyers: users.filter((user) => user.role === 'buyer').length,
            totalSellers: users.filter((user) => user.role === 'seller').length,
            totalAdmins: users.filter((user) => user.role === 'admin').length,
            totalProducts: products.length,
            approvedProducts: products.filter((product) => product.isApproved).length,
            pendingProducts: products.filter((product) => !product.isApproved && !product.rejectionReason).length,
            rejectedProducts: products.filter((product) => product.rejectionReason).length,
            totalVouchers: vouchers.length,
            activeVouchers: vouchers.filter((voucher) => voucher.isActive).length,
            totalOrders: paidOrders.length,
            totalRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role = 'buyer' } = req.body;
        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({ message: 'Email nay da ton tai.' });
        }

        const user = await User.create({ name, email, password, role });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Khong tim thay user.' });
        }

        user.name = req.body.name ?? user.name;
        user.email = req.body.email ?? user.email;
        user.role = req.body.role ?? user.role;
        if (req.body.password) {
            user.password = req.body.password;
        }

        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isBlocked: user.isBlocked,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleUserBlock = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Khong tim thay user.' });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Admin khong the tu khoa tai khoan cua minh.' });
        }

        user.isBlocked = req.body.isBlocked !== undefined ? Boolean(req.body.isBlocked) : !user.isBlocked;
        await user.save();
        res.json({ message: 'Da cap nhat trang thai tai khoan.', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Khong tim thay user.' });
        }

        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Admin khong the xoa tai khoan cua minh.' });
        }

        await user.deleteOne();
        res.json({ message: 'Da xoa user.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleProductLock = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Khong tim thay source.' });
        }

        product.isLocked = req.body.isLocked !== undefined ? Boolean(req.body.isLocked) : !product.isLocked;
        await product.save();
        res.json({ message: 'Da cap nhat trang thai source.', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviews = async (req, res) => {
    try {
        const products = await Product.find({ 'reviews.0': { $exists: true } })
            .populate('seller', 'name email')
            .select('title seller reviews');

        const reviews = products.flatMap((product) => product.reviews.map((review) => ({
            _id: review._id,
            productId: product._id,
            productTitle: product.title,
            seller: product.seller,
            user: review.user,
            name: review.name,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
        })));

        res.json(reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({ message: 'Khong tim thay source.' });
        }

        product.reviews = product.reviews.filter((review) => review._id.toString() !== req.params.reviewId);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.length
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
            : 0;

        await product.save();
        res.json({ message: 'Da xoa danh gia.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('orderItems.product', 'title price seller')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWithdrawRequests = async (req, res) => {
    try {
        const requests = await WithdrawRequest.find({})
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveWithdrawRequest = async (req, res) => {
    try {
        const request = await WithdrawRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Không tìm thấy yêu cầu rút tiền.' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Yêu cầu rút tiền này đã được xử lý rồi.' });
        }

        request.status = 'approved';
        await request.save();

        res.json({ message: 'Đã duyệt yêu cầu rút tiền thành công.', request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectWithdrawRequest = async (req, res) => {
    try {
        const { reason } = req.body;

        if (!reason || reason.trim().length < 5) {
            return res.status(400).json({ message: 'Vui lòng cung cấp lý do từ chối (tối thiểu 5 ký tự).' });
        }

        const request = await WithdrawRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Không tìm thấy yêu cầu rút tiền.' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Yêu cầu rút tiền này đã được xử lý rồi.' });
        }

        request.status = 'rejected';
        request.rejectionReason = reason;
        await request.save();

        // Hoàn lại tiền vào số dư của Seller
        await User.findByIdAndUpdate(request.seller, { $inc: { balance: request.amount } });

        res.json({ message: 'Đã từ chối yêu cầu rút tiền và hoàn lại số dư cho người bán.', request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOverview,
    getProducts,
    getUsers,
    createUser,
    updateUser,
    toggleUserBlock,
    deleteUser,
    toggleProductLock,
    getReviews,
    deleteReview,
    getOrders,
    getWithdrawRequests,
    approveWithdrawRequest,
    rejectWithdrawRequest,
};

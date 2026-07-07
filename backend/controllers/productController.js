const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Lấy tất cả sản phẩm đã duyệt, hỗ trợ search và pagination
// @route   GET /api/products?keyword=...&page=1&limit=12
const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            $or: [
                { title: { $regex: req.query.keyword, $options: 'i' } },
                { platform: { $regex: req.query.keyword, $options: 'i' } },
                { language: { $regex: req.query.keyword, $options: 'i' } }
            ]
        } : {};

        // Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments({ ...keyword, isApproved: true, isLocked: { $ne: true } });
        const pages = Math.ceil(totalProducts / limit);

        const products = await Product.find({ ...keyword, isApproved: true, isLocked: { $ne: true } })
            .populate('seller', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({ products, page, pages, totalProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lấy chi tiết một sản phẩm theo ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'name email');
        if (product && product.isLocked !== true) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Tạo sản phẩm mới (Seller only)
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        const { title, description, price, language, platform, image, sourceCodeFile } = req.body;

        const product = new Product({
            seller: req.user._id,
            title,
            description,
            price,
            language,
            platform,
            image,
            sourceCodeFile,
            isApproved: false
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Lấy sản phẩm chưa duyệt (Admin only)
// @route   GET /api/products/unapproved
const getUnapprovedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isApproved: false })
            .populate('seller', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Duyệt sản phẩm (Admin only)
// @route   PUT /api/products/:id/approve
const approveProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.isApproved = true;
            product.rejectionReason = '';
            const updatedProduct = await product.save();
            res.json({ message: 'Đã duyệt sản phẩm thành công', product: updatedProduct });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Từ chối sản phẩm kèm lý do (Admin only)
// @route   PUT /api/products/:id/reject
const rejectProduct = async (req, res) => {
    try {
        const { reason } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        product.isApproved = false;
        product.rejectionReason = reason;
        await product.save();

        res.json({ message: 'Đã từ chối sản phẩm', rejectionReason: reason });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Thêm review cho sản phẩm
// @route   POST /api/products/:id/reviews
const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Kiểm tra user đã mua sản phẩm chưa
        const hasPurchased = await Order.findOne({
            user: req.user._id,
            isPaid: true,
            'orderItems.product': req.params.id,
        });

        if (!hasPurchased) {
            return res.status(403).json({ message: 'Bạn cần mua sản phẩm này trước khi đánh giá.' });
        }

        // Kiểm tra user đã review sản phẩm này chưa
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này rồi.' });
        }

        // Tạo review mới
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({ message: 'Đánh giá đã được thêm thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    getUnapprovedProducts,
    approveProduct,
    rejectProduct,
    createProductReview,
};

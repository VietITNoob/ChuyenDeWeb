const Voucher = require('../models/Voucher');
const Product = require('../models/Product');

const normalizeCode = (code) => String(code || '').trim().toUpperCase();

const assertSellerOwnsProducts = async (sellerId, productIds = []) => {
    const uniqueIds = [...new Set(productIds.map(String))];

    if (uniqueIds.length === 0) {
        throw new Error('Vui long chon it nhat 1 san pham ap dung voucher.');
    }

    const count = await Product.countDocuments({
        _id: { $in: uniqueIds },
        seller: sellerId,
    });

    if (count !== uniqueIds.length) {
        throw new Error('Danh sach san pham ap dung khong hop le hoac khong thuoc seller nay.');
    }

    return uniqueIds;
};

const buildVoucherPayload = (body, sellerId) => ({
    code: normalizeCode(body.code),
    seller: sellerId,
    discountType: body.discountType,
    discountValue: Number(body.discountValue),
    applicableProducts: body.applicableProducts,
    startDate: body.startDate,
    endDate: body.endDate,
    usageLimit: Number(body.usageLimit) || 100,
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
});

const getMyVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find({ seller: req.user._id })
            .populate('applicableProducts', 'title price image isApproved')
            .sort({ createdAt: -1 });

        res.json(vouchers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find({})
            .populate('seller', 'name email')
            .populate('applicableProducts', 'title price image isApproved')
            .sort({ createdAt: -1 });

        res.json(vouchers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createVoucher = async (req, res) => {
    try {
        const productIds = await assertSellerOwnsProducts(req.user._id, req.body.applicableProducts);
        const payload = buildVoucherPayload(req.body, req.user._id);

        if (payload.discountType === 'percent' && payload.discountValue > 100) {
            return res.status(400).json({ message: 'Voucher phan tram khong duoc vuot qua 100%.' });
        }

        if (new Date(payload.endDate) <= new Date(payload.startDate)) {
            return res.status(400).json({ message: 'Ngay ket thuc phai lon hon ngay bat dau.' });
        }

        const voucher = await Voucher.create({
            ...payload,
            applicableProducts: productIds,
            status: 'pending',
            rejectionReason: '',
        });

        const createdVoucher = await Voucher.findById(voucher._id)
            .populate('applicableProducts', 'title price image isApproved');

        res.status(201).json(createdVoucher);
    } catch (error) {
        const status = error.code === 11000 ? 400 : 500;
        const message = error.code === 11000 ? 'Ma voucher nay da ton tai trong gian hang cua ban.' : error.message;
        res.status(status).json({ message });
    }
};

const updateVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({ message: 'Khong tim thay voucher.' });
        }

        if (voucher.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Ban khong co quyen sua voucher nay.' });
        }

        const productIds = await assertSellerOwnsProducts(req.user._id, req.body.applicableProducts);
        const payload = buildVoucherPayload(req.body, req.user._id);

        if (payload.discountType === 'percent' && payload.discountValue > 100) {
            return res.status(400).json({ message: 'Voucher phan tram khong duoc vuot qua 100%.' });
        }

        if (new Date(payload.endDate) <= new Date(payload.startDate)) {
            return res.status(400).json({ message: 'Ngay ket thuc phai lon hon ngay bat dau.' });
        }

        voucher.code = payload.code;
        voucher.discountType = payload.discountType;
        voucher.discountValue = payload.discountValue;
        voucher.applicableProducts = productIds;
        voucher.startDate = payload.startDate;
        voucher.endDate = payload.endDate;
        voucher.usageLimit = payload.usageLimit;
        voucher.isActive = payload.isActive;
        voucher.status = 'pending';
        voucher.rejectionReason = '';

        await voucher.save();

        const updatedVoucher = await Voucher.findById(voucher._id)
            .populate('applicableProducts', 'title price image isApproved');

        res.json(updatedVoucher);
    } catch (error) {
        const status = error.code === 11000 ? 400 : 500;
        const message = error.code === 11000 ? 'Ma voucher nay da ton tai trong gian hang cua ban.' : error.message;
        res.status(status).json({ message });
    }
};

const toggleVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({ message: 'Khong tim thay voucher.' });
        }

        const isOwner = voucher.seller.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Ban khong co quyen cap nhat voucher nay.' });
        }

        voucher.isActive = req.body.isActive !== undefined ? Boolean(req.body.isActive) : !voucher.isActive;
        await voucher.save();

        res.json({ message: 'Da cap nhat trang thai voucher.', voucher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({ message: 'Khong tim thay voucher.' });
        }

        const isOwner = voucher.seller.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Ban khong co quyen xoa voucher nay.' });
        }

        await voucher.deleteOne();
        res.json({ message: 'Da xoa voucher.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const validateVoucher = async (req, res) => {
    try {
        const { code, productIds = [] } = req.body;
        const voucher = await Voucher.findOne({
            code: normalizeCode(code),
            isActive: true,
            status: 'approved',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        }).populate('applicableProducts', 'title price');

        if (!voucher || voucher.usedCount >= voucher.usageLimit) {
            return res.status(404).json({ message: 'Voucher khong hop le hoac da het luot dung.' });
        }

        const applicableSet = new Set(voucher.applicableProducts.map((product) => product._id.toString()));
        const matchedProducts = productIds.filter((id) => applicableSet.has(String(id)));

        if (matchedProducts.length === 0) {
            return res.status(400).json({ message: 'Voucher khong ap dung cho san pham trong gio hang.' });
        }

        res.json({ voucher, matchedProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({ message: 'Khong tim thay voucher.' });
        }

        voucher.status = 'approved';
        voucher.rejectionReason = '';
        voucher.isActive = true;
        await voucher.save();

        res.json({ message: 'Da duyet voucher.', voucher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectVoucher = async (req, res) => {
    try {
        const voucher = await Voucher.findById(req.params.id);

        if (!voucher) {
            return res.status(404).json({ message: 'Khong tim thay voucher.' });
        }

        voucher.status = 'rejected';
        voucher.rejectionReason = req.body.reason || 'Voucher khong dat yeu cau.';
        voucher.isActive = false;
        await voucher.save();

        res.json({ message: 'Da tu choi voucher.', voucher });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyVouchers,
    getAllVouchers,
    createVoucher,
    updateVoucher,
    toggleVoucher,
    deleteVoucher,
    validateVoucher,
    approveVoucher,
    rejectVoucher,
};

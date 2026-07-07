const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        minlength: 3,
        maxlength: 30,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    discountType: {
        type: String,
        enum: ['percent', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0,
    },
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }],
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        required: true,
        min: 1,
        default: 100,
    },
    usedCount: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true,
        default: 'pending',
    },
    rejectionReason: {
        type: String,
        default: '',
    },
}, { timestamps: true });

voucherSchema.index({ code: 1, seller: 1 }, { unique: true });

module.exports = mongoose.model('Voucher', voucherSchema);

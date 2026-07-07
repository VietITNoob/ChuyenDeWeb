const mongoose = require('mongoose');

const withdrawRequestSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    amount: { type: Number, required: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    rejectionReason: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('WithdrawRequest', withdrawRequestSchema);

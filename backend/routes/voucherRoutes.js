const express = require('express');
const router = express.Router();
const {
    getMyVouchers,
    getAllVouchers,
    createVoucher,
    updateVoucher,
    toggleVoucher,
    deleteVoucher,
    validateVoucher,
    approveVoucher,
    rejectVoucher,
} = require('../controllers/voucherController');
const { protect, seller, admin } = require('../middlewares/authMiddleware');

router.get('/my', protect, seller, getMyVouchers);
router.get('/admin', protect, admin, getAllVouchers);
router.post('/', protect, seller, createVoucher);
router.post('/validate', protect, validateVoucher);
router.patch('/:id/approve', protect, admin, approveVoucher);
router.patch('/:id/reject', protect, admin, rejectVoucher);
router.put('/:id', protect, seller, updateVoucher);
router.patch('/:id/toggle', protect, toggleVoucher);
router.delete('/:id', protect, deleteVoucher);

module.exports = router;

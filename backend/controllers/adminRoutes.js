const express = require('express');
const router = express.Router();
const {
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
} = require('./adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/overview', protect, admin, getOverview);
router.get('/products', protect, admin, getProducts);
router.get('/users', protect, admin, getUsers);
router.post('/users', protect, admin, createUser);
router.put('/users/:id', protect, admin, updateUser);
router.patch('/users/:id/block', protect, admin, toggleUserBlock);
router.delete('/users/:id', protect, admin, deleteUser);
router.patch('/products/:id/lock', protect, admin, toggleProductLock);
router.get('/reviews', protect, admin, getReviews);
router.delete('/reviews/:productId/:reviewId', protect, admin, deleteReview);

module.exports = router;

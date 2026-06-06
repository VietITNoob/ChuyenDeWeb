const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({

    seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },

    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },


    language: { type: String, required: true },
    platform: { type: String, required: true },


    image: { type: String, required: true },
    sourceCodeFile: { type: String, required: true },


    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },


    isApproved: { type: Boolean, required: true, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
const Product = require('../models/Product');


const getProducts = async (req, res) => {
    try {

        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const products = await Product.find({ ...keyword, isApproved: true })
            .populate('seller', 'name email'); // Lấy thêm tên người bán
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


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

module.exports = { getProducts, createProduct };
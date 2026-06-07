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
        const {title, description, price, language, platform, image, sourceCodeFile} = req.body;

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
        res.status(400).json({message: error.message});
    }
};
const getUnapprovedProducts = async (req, res) => {
    try {
        const products = await Product.find({ isApproved: false })
            .populate('seller', 'name email');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.isApproved = true;
            const updatedProduct = await product.save();
            res.json({message: 'Đã duyệt sản phẩm thành công', product: updatedProduct});
        } else {
            res.status(404).json({message: 'Không tìm thấy sản phẩm'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports = { getProducts, createProduct,getUnapprovedProducts, approveProduct };
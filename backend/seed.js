/**
 * SEED DATA SCRIPT - CodeStore
 * Chạy: node seed.js
 * Mục đích: Tạo tài khoản seller + thêm sản phẩm mẫu vào MongoDB
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// ===== KẾT NỐI MONGODB =====
const MONGO_URI = process.env.MONGO_URI;

// ===== MODELS =====
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

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

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ===== DỮ LIỆU MẪU =====
const SELLER_EMAIL = 'seller@codestore.com';
const SELLER_PASSWORD = 'Seller@123';

const SAMPLE_PRODUCTS = [
    // ===== WEB PRODUCTS =====
    {
        title: 'E-Commerce Web App - React + Node.js',
        description: 'Website thương mại điện tử hoàn chỉnh với React 18, Node.js, MongoDB. Có đầy đủ chức năng: giỏ hàng, thanh toán VNPay, quản lý đơn hàng, dashboard admin. Code sạch, có comment tiếng Việt, dễ tùy chỉnh.',
        price: 1500000,
        language: 'JavaScript',
        platform: 'Web',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.8,
        numReviews: 24,
        isApproved: true,
    },
    {
        title: 'Admin Dashboard - Next.js 14 + TailwindCSS',
        description: 'Dashboard quản trị hiện đại dùng Next.js 14 App Router, TailwindCSS, Chart.js. Giao diện dark mode đẹp, responsive hoàn toàn. Bao gồm: quản lý user, báo cáo thống kê, CRUD đầy đủ.',
        price: 1200000,
        language: 'TypeScript',
        platform: 'Web',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.6,
        numReviews: 18,
        isApproved: true,
    },
    {
        title: 'Blog Platform - Vue 3 + Vite + Firebase',
        description: 'Nền tảng blog cá nhân xây dựng với Vue 3 Composition API, Vite và Firebase. Hỗ trợ Markdown editor, SEO tốt, upload ảnh Cloudinary, đăng nhập Google OAuth.',
        price: 800000,
        language: 'JavaScript',
        platform: 'Web',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.3,
        numReviews: 11,
        isApproved: true,
    },
    {
        title: 'Landing Page Template - HTML + CSS + GSAP',
        description: 'Bộ 5 landing page cao cấp với animation GSAP smooth, hero section ấn tượng, form liên hệ. Tối ưu tốc độ load, điểm Lighthouse 95+. Phù hợp startup, SaaS, Agency.',
        price: 450000,
        language: 'HTML/CSS',
        platform: 'Web',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.9,
        numReviews: 42,
        isApproved: true,
    },
    {
        title: 'Chat App Real-time - React + Socket.io',
        description: 'Ứng dụng chat thời gian thực với React, Socket.io, Node.js. Có phòng chat, tin nhắn riêng, thông báo online/offline, upload file trong chat, emoji picker.',
        price: 950000,
        language: 'JavaScript',
        platform: 'Web',
        image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.5,
        numReviews: 15,
        isApproved: true,
    },
    {
        title: 'Task Management - React + Redux + Express',
        description: 'Ứng dụng quản lý công việc kiểu Trello với drag & drop, assign task, deadline, filter, export PDF. Sử dụng React, Redux Toolkit, Express, PostgreSQL.',
        price: 1100000,
        language: 'TypeScript',
        platform: 'Web',
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.7,
        numReviews: 29,
        isApproved: true,
    },

    // ===== MOBILE PRODUCTS =====
    {
        title: 'Food Delivery App - React Native + Expo',
        description: 'Ứng dụng đặt đồ ăn hoàn chỉnh dùng React Native + Expo. Có map tích hợp Google Maps, theo dõi đơn hàng realtime, thanh toán Stripe, đánh giá nhà hàng. Chạy được trên iOS và Android.',
        price: 2000000,
        language: 'JavaScript',
        platform: 'Mobile',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.9,
        numReviews: 38,
        isApproved: true,
    },
    {
        title: 'Fitness Tracker - Flutter + Firebase',
        description: 'App theo dõi sức khỏe & tập luyện dùng Flutter. Đếm bước chân, quản lý workout, biểu đồ calo, kết nối Apple Health/Google Fit. UI đẹp với animation mượt mà.',
        price: 1800000,
        language: 'Dart',
        platform: 'Mobile',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.6,
        numReviews: 22,
        isApproved: true,
    },
    {
        title: 'Finance Manager - React Native',
        description: 'App quản lý tài chính cá nhân với React Native. Theo dõi thu chi, tạo ngân sách, biểu đồ thống kê đẹp, xuất báo cáo PDF, hỗ trợ nhiều loại tiền tệ.',
        price: 1300000,
        language: 'TypeScript',
        platform: 'Mobile',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.4,
        numReviews: 16,
        isApproved: true,
    },

    // ===== UI KITS =====
    {
        title: 'SaaS UI Kit - Figma + React Components',
        description: 'Bộ UI Kit SaaS đầy đủ gồm 120+ component Figma và React. Có design token, dark/light mode, responsive grid system. Phù hợp xây dựng dashboard, landing page SaaS nhanh chóng.',
        price: 600000,
        language: 'CSS',
        platform: 'UI Kit',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.8,
        numReviews: 53,
        isApproved: true,
    },
    {
        title: 'Icon Pack Premium - 2000+ SVG Icons',
        description: 'Bộ 2000+ icon vector SVG phong cách tối giản, nhất quán. Xuất được PNG, SVG, PDF. Có 6 bộ style: Outline, Filled, Duotone, Thin, Bold, Color. Dùng tốt cho web, mobile, print.',
        price: 350000,
        language: 'SVG',
        platform: 'UI Kit',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.7,
        numReviews: 67,
        isApproved: true,
    },
    {
        title: 'Design System - TailwindCSS Components',
        description: 'Hệ thống design hoàn chỉnh với 80+ component TailwindCSS. Bao gồm: form, modal, table, card, sidebar, navigation. Dễ copy-paste, tùy chỉnh màu sắc theo brand.',
        price: 750000,
        language: 'CSS',
        platform: 'UI Kit',
        image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.5,
        numReviews: 31,
        isApproved: true,
    },

    // ===== PYTHON / BACKEND =====
    {
        title: 'REST API Boilerplate - FastAPI + PostgreSQL',
        description: 'Template khởi động API chuẩn production với FastAPI, PostgreSQL, Alembic migration, JWT auth, rate limiting, caching Redis, Docker. Có sẵn CI/CD GitHub Actions.',
        price: 900000,
        language: 'Python',
        platform: 'Web',
        image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.9,
        numReviews: 44,
        isApproved: true,
    },
    {
        title: 'Machine Learning Dashboard - Python + Streamlit',
        description: 'Dashboard phân tích dữ liệu và ML với Streamlit, Pandas, Matplotlib, Scikit-learn. Hỗ trợ upload CSV, vẽ biểu đồ tương tác, train model trực tiếp trên browser.',
        price: 700000,
        language: 'Python',
        platform: 'Web',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        sourceCodeFile: 'https://res.cloudinary.com/demo/raw/upload/sample.zip',
        rating: 4.4,
        numReviews: 19,
        isApproved: true,
    },
];

// ===== MAIN =====
async function seed() {
    try {
        console.log('🔌 Đang kết nối MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected!\n');

        // 1. Tạo hoặc lấy tài khoản Seller
        console.log(`👤 Tạo/lấy tài khoản seller: ${SELLER_EMAIL}`);
        let seller = await User.findOne({ email: SELLER_EMAIL });

        if (!seller) {
            seller = new User({
                name: 'CodeStore Seller',
                email: SELLER_EMAIL,
                password: SELLER_PASSWORD,
                role: 'seller',
            });
            await seller.save();
            console.log(`   ✅ Đã tạo tài khoản seller mới`);
            console.log(`   📧 Email   : ${SELLER_EMAIL}`);
            console.log(`   🔑 Password: ${SELLER_PASSWORD}`);
        } else {
            console.log(`   ℹ️  Seller đã tồn tại (ID: ${seller._id})`);
        }

        // 2. Xóa sản phẩm cũ của seller này (nếu muốn chạy lại từ đầu)
        const existingCount = await Product.countDocuments({ seller: seller._id });
        if (existingCount > 0) {
            console.log(`\n🗑️  Xóa ${existingCount} sản phẩm cũ của seller...`);
            await Product.deleteMany({ seller: seller._id });
            console.log(`   ✅ Đã xóa`);
        }

        // 3. Thêm sản phẩm mẫu
        console.log(`\n📦 Đang thêm ${SAMPLE_PRODUCTS.length} sản phẩm mẫu...`);
        const productsToInsert = SAMPLE_PRODUCTS.map(p => ({
            ...p,
            seller: seller._id,
        }));

        const inserted = await Product.insertMany(productsToInsert);
        console.log(`\n✅ THÀNH CÔNG! Đã thêm ${inserted.length} sản phẩm:\n`);

        inserted.forEach((p, i) => {
            console.log(`   ${i + 1}. [${p.platform}] ${p.title}`);
            console.log(`      💰 ${p.price.toLocaleString('vi-VN')}đ | ⭐ ${p.rating} | ✅ Đã duyệt`);
        });

        console.log('\n==================================================');
        console.log('🎉 SEED DATA HOÀN THÀNH!');
        console.log('==================================================');
        console.log(`\n📋 THÔNG TIN ĐĂNG NHẬP:`);
        console.log(`   Seller - Email   : ${SELLER_EMAIL}`);
        console.log(`   Seller - Password: ${SELLER_PASSWORD}`);
        console.log(`\n🌐 Truy cập: http://localhost:5173`);
        console.log(`🔗 API     : http://localhost:5000/api/products\n`);

    } catch (error) {
        console.error('❌ Lỗi seed data:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Đã ngắt kết nối MongoDB');
        process.exit(0);
    }
}

seed();

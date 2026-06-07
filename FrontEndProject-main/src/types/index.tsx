// =============================================
// PRODUCT TYPES (khớp với MongoDB schema)
// =============================================
export interface Product {
    _id: string;             // MongoDB ObjectId
    id?: string | number;   // alias cho _id (tương thích code cũ)
    title: string;
    description: string;
    price: number;
    language: string;       // ngôn ngữ lập trình (VD: "JavaScript", "Python")
    platform: string;       // nền tảng (VD: "Web", "Mobile")
    image: string;
    sourceCodeFile: string; // URL file zip trên Cloudinary
    seller: {
        _id: string;
        name: string;
        email: string;
    } | string;
    reviews: Review[];
    rating: number;
    numReviews: number;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;

    // Các field cũ giữ lại để tương thích giao diện
    discount?: number;
    categoryId?: string;
    sold?: number;
    tech?: string[];
    database?: string[];
    UI_Framework?: string[];
    BackEnd?: string;
    marketingBadge?: string;
}

export interface ProductParams {
    keyword?: string;        // backend dùng `keyword` để tìm kiếm theo title
    // Giữ lại các param cũ để không break code hiện tại
    title_like?: string;
    categoryId?: string;
    q?: string;
}

export interface FilterState {
    search: string;
    category: string;
    tech: string;
}

// =============================================
// CATEGORY TYPES
// =============================================
export interface Category {
    id: number | string;
    name: string;
    image: string;
}

// =============================================
// REVIEW TYPES (nhúng trong Product MongoDB)
// =============================================
export interface Review {
    _id?: string;
    user: string;            // ObjectId của User
    name: string;            // Tên người review
    rating: number;
    comment: string;
    createdAt?: string;
    // Giữ lại field cũ để tương thích
    id?: number;
    userId?: number;
    productId?: number;
    date?: string;
    content?: string;
}

// =============================================
// USER TYPES (khớp với MongoDB schema)
// =============================================
export interface User {
    _id: string;             // MongoDB ObjectId
    id?: string | number;   // alias (tương thích code cũ)
    name: string;            // Backend dùng `name`, không phải firstName/lastName
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    // Các field cũ giữ lại
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
}

// =============================================
// ORDER TYPES (khớp với MongoDB schema)
// =============================================
export interface OrderItem {
    product: string;         // ObjectId của Product
    title: string;
    price: number;
    image: string;
}

export interface Order {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    paymentMethod: string;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    createdAt: string;
}

// =============================================
// AUTH RESPONSE (từ /api/auth/login & /register)
// =============================================
export interface AuthResponse {
    _id: string;
    name: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    token: string;
}

// =============================================
// PRODUCT PROPS (giữ nguyên cho component cũ)
// =============================================
export interface ProductProps {
  data: {
    id: number | string;
    tag?: string;
    title: string;
    price: string | number;
    image: string;
    isDark?: boolean;
  };
}

// =============================================
// DATE TYPE (giữ nguyên)
// =============================================
export interface DateType {
    month: string;
    day: string;
    year: string;
}
import React from 'react';
import type { Product } from '../../../types';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
    product: Product;
}

const HeroSection: React.FC<HeroSectionProps> = ({ product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, isInWishlist } = useWishlist();
    const [isWishlisted, setIsWishlisted] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        setIsWishlisted(isInWishlist(product._id));
    }, [product._id, isInWishlist]);

    const handleAddToCart = async () => {
        await addToCart(product);
    };

    const handleAddandGoToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await addToCart(product);
        navigate('/cart');
    };

    const handleAddToWishlist = async () => {
        if (!isWishlisted) {
            await addToWishlist(product);
            setIsWishlisted(true);
        }
    };

    const hasDiscount = product.discount > 0;
    const discountedPrice = hasDiscount
        ? product.price * (1 - product.discount / 100)
        : product.price;

    return (
        <section className="pt-24 md:pt-32 pb-16 px-4 md:px-8 text-center animate-enter overflow-hidden bg-white">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-apple-dark mb-4 leading-tight">
                    {product.title} <br />
                    <span className="text-apple-gray">Hiệu năng đột phá.</span>
                </h1>
                <p className="text-lg md:text-xl text-apple-gray max-w-2xl mx-auto mb-10 leading-relaxed">
                    {product.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <button 
                        className="bg-apple-blue text-white font-semibold py-3 px-8 rounded-full shadow-[0_4px_14px_rgba(0,113,227,0.4)] hover:bg-[#0077ed] hover:shadow-[0_6px_20px_rgba(0,113,227,0.6)] hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto" 
                        onClick={handleAddToCart}
                    >
                        Thêm vào giỏ
                    </button>
                    
                    <button 
                        className={`flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-full border-2 transition-all duration-300 w-full sm:w-auto ${
                            isWishlisted 
                                ? 'bg-[#fff0f0] border-[#fff0f0] text-[#ff3b30] shadow-[0_4px_14px_rgba(255,59,48,0.2)]' 
                                : 'bg-transparent border-apple-border text-apple-dark hover:border-[#ff3b30] hover:text-[#ff3b30]'
                        }`}
                        onClick={handleAddToWishlist}
                        disabled={isWishlisted}
                    >
                        <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                        {isWishlisted ? 'Đã thêm vào yêu thích' : 'Thêm vào yêu thích'}
                    </button>
                    
                    <button 
                        className="flex items-center justify-center gap-2 font-semibold py-3 px-8 rounded-full bg-apple-lightbg text-apple-dark hover:bg-apple-border transition-all duration-300 w-full sm:w-auto" 
                        onClick={handleAddandGoToCart}
                    >
                        <span>Mua ngay — {discountedPrice.toLocaleString()}đ</span>
                        {hasDiscount && (
                            <span className="line-through opacity-50 text-sm">
                                {product.price.toLocaleString()}đ
                            </span>
                        )}
                    </button>
                </div>
                <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-apple hover:shadow-apple-hover transition-shadow duration-500 bg-white">
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 ease-out" 
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

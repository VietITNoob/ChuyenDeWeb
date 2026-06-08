import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import type { ProductProps } from '../../../types';

const ProductCard: React.FC<ProductProps> = ({ data }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(data as any);
  };

  const handleCardClick = () => {
    navigate(`/product/${data._id || data.id}`);
  };

  // Logic hiển thị tag
  const tag = data.tag || '';
  const isAI = tag.toLowerCase().includes('ai') || tag.toLowerCase().includes('intelligence') || tag.includes('Best Seller');
  const isNew = tag.toLowerCase().includes('new') || tag.toLowerCase().includes('free');

  return (
    <div 
      className="bg-white rounded-[20px] p-6 relative h-[400px] md:h-[340px] flex flex-col justify-between cursor-pointer border border-black/5 shadow-[0_4px_6px_rgba(0,0,0,0.02)] transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-[1.02] hover:shadow-[0_14px_24px_rgba(0,0,0,0.08)] hover:border-transparent hover:z-10 group overflow-hidden" 
      onClick={handleCardClick}
    >
      <div className="z-10 mb-2.5">
        {tag && (
          <div
            className={`inline-block text-[11px] font-bold uppercase tracking-[0.05em] mb-2 ${isAI ? 'bg-gradient-to-r from-apple-blue to-[#9b51e0] text-transparent bg-clip-text' : isNew ? 'text-[#f56300]' : 'text-[#6e6e73]'}`}
          >
            {tag}
          </div>
        )}

        <h3 className="text-[17px] md:text-[20px] font-semibold text-apple-dark m-0 mb-1.5 leading-[1.3] line-clamp-2 overflow-hidden text-ellipsis">
          {data.title}
        </h3>
        <p className="text-[15px] text-apple-dark/80 m-0 font-medium">
          {data.price ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(data.price)) : 'Liên hệ'}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center relative mt-2.5 mb-[30px]">
        <img 
          src={data.image} 
          alt={data.title} 
          className="w-full h-full object-contain filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105" 
        />
      </div>

      {/* Nút cộng tròn */}
      <button 
        onClick={handleAddToCart} 
        className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-[#e8e8ed] border-none p-0 m-0 flex items-center justify-center text-apple-dark cursor-pointer z-20 transition-all duration-200 hover:bg-apple-blue hover:text-white hover:scale-110 hover:shadow-[0_4px_10px_rgba(0,113,227,0.4)]" 
        aria-label="Add to cart"
      >
        <Plus className="w-5 h-5 block" stroke="currentColor" />
      </button>
    </div>
  );
};

export default ProductCard;
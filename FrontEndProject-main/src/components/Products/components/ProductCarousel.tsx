import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  titleStart: string;
  titleHighlight: string;
  products: any[];
}

const ProductCarousel: React.FC<CarouselProps> = ({ titleStart, titleHighlight, products }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 420; // Cuộn bằng khoảng chiều rộng card + gap
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="mb-10">
      {/* Header + Nút điều hướng */}
      <div className="max-w-[1440px] mx-auto mb-8 px-12 flex justify-between items-end">
        <div className="text-[32px] font-bold tracking-[-0.01em] m-0 p-0">
          <span className="text-apple-gray">{titleStart} </span>
          <span className="bg-gradient-to-r from-apple-blue via-[#c644fc] to-[#f64949] text-transparent bg-clip-text animate-[aurora_6s_ease_infinite_alternate] bg-[length:300%_300%]">{titleHighlight}</span>
        </div>
        
        {/* Nút điều hướng góc trên phải (Style Apple) */}
        <div className="flex gap-3.5">
          <button 
            onClick={() => scroll('left')} 
            className="w-10 h-10 rounded-full border-none bg-black/5 text-apple-dark cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-black/10 active:scale-95" 
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="w-10 h-10 rounded-full border-none bg-black/5 text-apple-dark cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-black/10 active:scale-95" 
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Container chứa Card */}
      <div className="flex overflow-x-auto gap-7 py-7 px-12 pb-[100px] snap-x snap-mandatory scroll-smooth scrollbar-hide" ref={scrollRef}>
        {products.map((product) => (
          <div key={product._id || product.id} className="snap-start min-w-[400px] md:min-w-[420px]">
            <ProductCard data={product} />
          </div>
        ))}
        
        {/* Spacer cuối cùng để không bị cấn lề phải */}
        <div className="min-w-[20px] snap-end"></div> 
      </div>
    </section>
  );
};

export default ProductCarousel;
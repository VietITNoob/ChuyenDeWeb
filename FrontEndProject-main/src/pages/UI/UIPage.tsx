import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useProductList } from '../../hook/useProductList';
import ProductCarousel from '../../components/Products/components/ProductCarousel';

const UIPage = () => {
  const { fetchByCategory, byCategory } = useProductList();
  
  const UI_CATEGORY_ID = 'ui'; 

  const DESIGN_TOOLS = ['All', 'Figma', 'Sketch', 'Adobe XD', 'Tailwind', 'Icons', '3D'];
  
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

 useEffect(() => {
    fetchByCategory(UI_CATEGORY_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayedProducts = useMemo(() => {
    if (filter === 'All') return byCategory;
    return byCategory.filter(p => p.title.toLowerCase().includes(filter.toLowerCase()));
  }, [byCategory, filter]);

  const bestSellers = useMemo(() => {
    return byCategory.slice(0, 4);
  }, [byCategory]);

  return (
    <div className="bg-[#f5f5f7] min-h-screen pb-[80px] font-sans animate-enter">
      <Header />

      {/* --- HERO SECTION --- */}
      <section className="text-center pt-[100px] px-5 pb-[60px] bg-white mb-5">
        <h1 className="text-[42px] md:text-[64px] font-bold leading-[1.05] text-apple-dark mb-2.5 tracking-[-0.02em]">
          UI Kits. <span className="text-[#86868b]">Pixel Perfect.</span>
        </h1>
        <p className="text-[24px] font-normal text-[#6e6e73] mt-1.5 max-w-[650px] mx-auto">
          Nâng tầm thiết kế với bộ sưu tập Figma, Icons và Design Systems cao cấp.
        </p>
      </section>

      {/* --- QUICK FILTER NAV --- */}
      <div className="flex justify-center gap-3 mb-[60px] flex-wrap px-5">
        {DESIGN_TOOLS.map((item) => (
          <button 
            key={item}
            className={`py-2.5 px-6 rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-300 border-none ${filter === item ? 'bg-[#1d1d1f] text-white scale-105' : 'bg-[#e8e8ed] text-apple-dark hover:bg-[#1d1d1f] hover:text-white hover:scale-105'}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* --- FEATURED BANNER 1: Figma System --- */}
      <section className="max-w-[1300px] mx-auto my-[60px] px-5">
        <div className="relative rounded-[32px] overflow-hidden h-[420px] md:h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-400 cursor-pointer group hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
           <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2264&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-105"
              alt="Design System"
           />
           <div className="absolute top-[60px] left-0 w-full text-center z-10 text-white">
              <h2 className="text-[36px] md:text-[52px] font-extrabold m-0 tracking-[-0.02em]">Ultimate Figma System</h2>
              <p className="text-[20px] font-medium mt-2.5 max-w-[500px] mx-auto px-5">
                Hơn 5000+ Components. Auto Layout 5.0. Dark Mode Ready.
              </p>
              <a href="#" className="mt-6 inline-block bg-apple-blue text-white py-3.5 px-8 rounded-full no-underline text-[16px] font-semibold transition-transform duration-200 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:bg-[#0077ED] hover:scale-105">Xem Preview</a>
           </div>
        </div>
      </section>

      {/* --- DANH SÁCH SẢN PHẨM CHÍNH --- */}
      <div className="-mt-10">
         <ProductCarousel 
            titleStart={filter === 'All' ? "Thư viện thiết kế." : `${filter} Assets.`}
            titleHighlight="Cảm hứng bất tận."
            products={displayedProducts} 
          />
      </div>

      {/* --- FEATURED BANNER 2: 3D Icons / Illustrations --- */}
      <section className="max-w-[1300px] mx-auto my-[60px] px-5">
        <div className="relative rounded-[32px] overflow-hidden h-[420px] md:h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-400 cursor-pointer group hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
           <img 
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-105"
              alt="3D Icons"
           />
           <div className="absolute top-[60px] left-0 w-full text-center z-10 text-apple-dark">
              <h2 className="text-[36px] md:text-[52px] font-extrabold m-0 tracking-[-0.02em]">3D Abstract Pack</h2>
              <p className="text-[20px] font-medium mt-2.5 max-w-[500px] mx-auto px-5">
                Bộ sưu tập hình khối 3D chất lượng 4K. Tương thích Blender & C4D.
              </p>
              <a href="#" className="mt-6 inline-block bg-[#1d1d1f] text-white py-3.5 px-8 rounded-full no-underline text-[16px] font-semibold transition-transform duration-200 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:opacity-80 hover:scale-105">Mua ngay</a>
           </div>
        </div>
      </section>

      {/* --- BEST SELLERS --- */}
      <ProductCarousel 
        titleStart="Trending."
        titleHighlight="Xu hướng thiết kế 2026."
        products={bestSellers} 
      />

      {/* --- BANNER PHỤ: Icon Set --- */}
      <section className="max-w-[1300px] mx-auto my-[60px] px-5">
        <div className="relative rounded-[32px] overflow-hidden h-[400px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-400 cursor-pointer group hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
           <img 
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2148&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-105"
              alt="Icon Set"
           />
           <div className="absolute top-[60px] left-0 w-full text-center z-10 text-apple-dark">
              <h2 className="text-[32px] font-extrabold m-0 tracking-[-0.02em]">Minimalist Icons</h2>
              <p className="text-[18px] font-medium mt-2.5 max-w-[500px] mx-auto px-5">
                2000+ vector icons. Sạch sẽ, tinh tế, đa dụng.
              </p>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UIPage;
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useProductList } from '../../hook/useProductList';
import ProductCarousel from '../../components/Products/components/ProductCarousel';

const WebPage = () => {
  const { fetchByCategory, byCategory } = useProductList();
  
  const WEB_CATEGORY_ID = 'web'; 

  const TECH_STACKS = ['All', 'React', 'Next.js', 'Vue', 'Laravel', 'Node.js', 'Tailwind'];
  
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

 useEffect(() => {
    fetchByCategory(WEB_CATEGORY_ID);
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
        <h1 className="text-[40px] md:text-[56px] font-bold leading-[1.05] text-apple-dark mb-2.5 tracking-[-0.01em]">
          Websites. <span className="text-[#6e6e73]">Powerful. Scalable.</span>
        </h1>
        <p className="text-[18px] md:text-[24px] font-normal text-[#6e6e73] mt-1.5 max-w-[600px] mx-auto">
          Xây dựng nền tảng SaaS, Dashboard và E-commerce với tốc độ ánh sáng.
        </p>
      </section>

      {/* --- QUICK FILTER NAV --- */}
      <div className="flex justify-center gap-3 mb-[60px] flex-wrap px-5">
        {TECH_STACKS.map((item) => (
          <button 
            key={item}
            className={`py-2.5 px-6 rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-300 border-none ${filter === item ? 'bg-[#1d1d1f] text-white scale-105' : 'bg-[#e8e8ed] text-apple-dark hover:bg-[#1d1d1f] hover:text-white hover:scale-105'}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* --- FEATURED BANNER 1: SaaS / Dashboard --- */}
      <section className="max-w-[1300px] mx-auto my-[60px] px-5">
        <div className="relative rounded-[28px] overflow-hidden h-[420px] md:h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-400 cursor-pointer group hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
           <img 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-800 brightness-70 group-hover:scale-[1.03]"
              alt="SaaS Dashboard"
           />
           <div className="absolute top-[60px] left-0 w-full text-center z-10 text-white">
              <h2 className="text-[32px] md:text-[48px] font-bold m-0 tracking-[-0.01em]">Ultimate SaaS Starter</h2>
              <p className="text-[16px] md:text-[20px] font-normal mt-2.5 max-w-[500px] mx-auto px-5">
                Next.js 14, Stripe, Supabase & Tailwind. All-in-one kit.
              </p>
              <a href="#" className="mt-6 inline-block bg-apple-blue text-white py-3 px-7 rounded-full no-underline text-[15px] font-medium transition-all hover:bg-[#0077ED] hover:scale-105">Xem Live Demo</a>
           </div>
        </div>
      </section>

      {/* --- DANH SÁCH SẢN PHẨM CHÍNH --- */}
      <div className="-mt-10">
         <ProductCarousel 
            titleStart={filter === 'All' ? "Khám phá Web." : `${filter} Projects.`}
            titleHighlight="Code sạch, chuẩn SEO."
            products={displayedProducts} 
          />
      </div>

      {/* --- FEATURED BANNER 2: Admin / CMS --- */}
      <section className="max-w-[1300px] mx-auto my-[60px] px-5">
        <div className="relative rounded-[28px] overflow-hidden h-[420px] md:h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-400 cursor-pointer group hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
           <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2372&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-[1.03]"
              alt="Coding"
           />
           <div className="absolute top-[60px] left-0 w-full text-center z-10 text-apple-dark">
              <h2 className="text-[32px] md:text-[48px] font-bold m-0 tracking-[-0.01em]">Admin Dashboard Pro</h2>
              <p className="text-[16px] md:text-[20px] font-normal mt-2.5 max-w-[500px] mx-auto px-5">
                Quản lý dữ liệu trực quan với React & Ant Design. Dark mode included.
              </p>
              <a href="#" className="mt-6 inline-block bg-[#1d1d1f] text-white py-3 px-7 rounded-full no-underline text-[15px] font-medium transition-all hover:opacity-80 hover:scale-105">Mua ngay</a>
           </div>
        </div>
      </section>

      {/* --- BEST SELLERS --- */}
      <ProductCarousel 
        titleStart="Top Rated."
        titleHighlight="Được các Startup tin dùng."
        products={bestSellers} 
      />

      {/* --- BANNER PHỤ: Portfolio / Landing Page --- */}
      <section className="max-w-[1300px] mx-auto my-[60px] px-5">
        <div className="relative rounded-[28px] overflow-hidden h-[400px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-400 cursor-pointer group hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
           <img 
              src="https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=2370&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-[1.03]"
              alt="Creative Portfolio"
           />
           <div className="absolute top-[60px] left-0 w-full text-center z-10 text-white">
              <h2 className="text-[32px] font-bold m-0 tracking-[-0.01em]">Creative Portfolio</h2>
              <p className="text-[18px] font-normal mt-2.5 max-w-[500px] mx-auto px-5">
                Thể hiện cá tính của bạn. Hiệu ứng GSAP mượt mà.
              </p>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WebPage;
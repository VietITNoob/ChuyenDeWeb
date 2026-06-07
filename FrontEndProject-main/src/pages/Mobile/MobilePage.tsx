import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useProductList } from '../../hook/useProductList';
import ProductCarousel from '../../components/Products/components/ProductCarousel';

const MobilePage = () => {
  const { fetchByCategory, byCategory } = useProductList();
  
  const MOBILE_CATEGORY_ID = 'mobile'; 

  const TECH_STACKS = ['All', 'Flutter', 'React Native', 'Swift', 'Kotlin', 'Ionic'];
  
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

 useEffect(() => {
    fetchByCategory(MOBILE_CATEGORY_ID);
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
          Mobile Apps. <span className="text-[#6e6e73]">Code less. Create more.</span>
        </h1>
        <p className="text-[20px] md:text-[24px] font-normal text-[#6e6e73] mt-1.5">
          Khởi động dự án của bạn với các mẫu Source Code chất lượng cao.
        </p>
      </section>

      {/* --- QUICK FILTER NAV --- */}
      <div className="flex justify-center gap-[15px] mb-[60px] flex-wrap px-5">
        {TECH_STACKS.map((item) => (
          <button 
            key={item}
            className={`py-2.5 px-6 rounded-full text-[14px] font-semibold cursor-pointer transition-colors duration-300 border-none ${filter === item ? 'bg-[#1d1d1f] text-white' : 'bg-[#e8e8ed] text-apple-dark hover:bg-[#1d1d1f] hover:text-white'}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* --- FEATURED BANNER 1: E-commerce / Super App --- */}
      <section className="max-w-[1300px] mx-auto my-[60px] px-5">
        <div className="relative rounded-[28px] overflow-hidden h-[400px] md:h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-400 group hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
           <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-800 brightness-80 group-hover:scale-[1.03]"
              alt="App UI"
           />
           <div className="absolute top-[50px] left-0 w-full text-center z-10 text-white">
              <h2 className="text-[32px] md:text-[44px] font-bold m-0">Super E-commerce Kit</h2>
              <p className="text-[18px] md:text-[20px] font-normal mt-2">
                Full Flutter Source Code. iOS & Android ready.
              </p>
              <a href="#" className="mt-5 inline-block bg-apple-blue text-white py-2.5 px-5 rounded-full no-underline text-[15px] font-medium transition-colors hover:bg-[#0077ed]">Xem Demo</a>
           </div>
        </div>
      </section>

      {/* --- DANH SÁCH SẢN PHẨM --- */}
      <div className="-mt-10">
         <ProductCarousel 
            titleStart={filter === 'All' ? "Kho ứng dụng." : `${filter} Templates.`}
            titleHighlight="Giải pháp tối ưu cho Developer."
            products={displayedProducts} 
          />
      </div>

      {/* --- FEATURED BANNER 2: Social / Delivery App --- */}
      <section className="max-w-[1300px] mx-auto my-[60px] px-5">
        <div className="relative rounded-[28px] overflow-hidden h-[400px] md:h-[500px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-transform duration-400 group hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
           <img 
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-[1.03]"
              alt="Social App"
           />
           <div className="absolute top-[50px] left-0 w-full text-center z-10 text-apple-dark"> 
              <h2 className="text-[32px] md:text-[44px] font-bold m-0">Social Network App</h2>
              <p className="text-[18px] md:text-[20px] font-normal mt-2">
                Xây dựng cộng đồng của riêng bạn. Tích hợp Chat & Video Call.
              </p>
              <a href="#" className="mt-5 inline-block bg-[#1d1d1f] text-white py-2.5 px-5 rounded-full no-underline text-[15px] font-medium transition-opacity hover:opacity-80">Mua Source Code</a>
           </div>
        </div>
      </section>

      {/* --- BEST SELLERS --- */}
      <ProductCarousel 
        titleStart="Bán chạy nhất."
        titleHighlight="Các dự án được tin dùng."
        products={bestSellers} 
      />

      <Footer />
    </div>
  );
};

export default MobilePage;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import type { Product } from '../../types';
import { productService } from '../../service/productService';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    productService.getNewProduct()
      .then((data) => {
        setFeaturedProducts(data.slice(0, 4));
      })
      .catch((err) => console.error("Lỗi tải sản phẩm nổi bật:", err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    const hiddenElements = document.querySelectorAll('.reveal');
    hiddenElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [featuredProducts]);

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div className="min-h-screen pt-[60px] overflow-x-hidden font-sans">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="text-center pt-[140px] pb-[100px] px-5 max-w-[1000px] mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(circle_at_50%_50%,rgba(0,113,227,0.12)_0%,rgba(155,81,224,0.08)_30%,rgba(255,255,255,0)_70%)] blur-[80px] z-0 pointer-events-none animate-[pulse-glow_8s_ease-in-out_infinite_alternate]"></div>
        <div className="reveal">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-[10px] py-2 px-4 rounded-[30px] text-[13px] font-semibold text-apple-dark mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-black/5 relative z-10">
             <span className="text-apple-blue">Mới</span> AI Generator Code v2.0
          </div>
          <h1 className="text-[48px] md:text-[72px] leading-[1.05] font-bold tracking-[-0.03em] text-apple-dark mb-6 relative z-10">
            Mã nguồn <span className="bg-[linear-gradient(180deg,#1d1d1f_0%,#434344_100%)] bg-clip-text text-transparent">tinh hoa.</span><br />
            Hiệu năng <span className="bg-[linear-gradient(90deg,#2997ff,#9b51e0,#2997ff)] bg-[length:200%_auto] bg-clip-text text-transparent animate-[shine_4s_linear_infinite]">đột phá.</span>
          </h1>
          <p className="text-[20px] md:text-[26px] leading-[1.4] text-apple-gray max-w-[680px] mx-auto mb-12 font-normal relative z-10">
            Khám phá thư viện source code cao cấp dành cho Web & Mobile.
            Được kiểm duyệt kỹ lưỡng, sạch sẽ và sẵn sàng scale-up.
          </p>
          <div className="flex gap-5 justify-center relative z-10">
            <Link to="/products" className="bg-apple-dark text-white py-3.5 px-9 rounded-full text-[17px] font-medium no-underline transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)]">Mua trọn bộ</Link>
          </div>
        </div>
      </section>

      {/* 2. BENTO GRID */}
      <section className="max-w-[1200px] mx-auto px-5">
        <div className="reveal mb-10 text-left">
          <h2 className="text-[48px] font-bold text-apple-dark">Sản phẩm tiêu biểu.</h2>
        </div>

        {featuredProducts.length >= 4 && (
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[400px] md:auto-rows-[minmax(380px,auto)] gap-6">
            
            <Link to={`/product/${featuredProducts[0]._id}`} className="bg-apple-lightbg rounded-3xl p-[30px] relative overflow-hidden no-underline text-apple-dark flex flex-col justify-between border border-black/5 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:z-10 group reveal md:col-span-2">
              <div className="z-10 relative">
                <span className="inline-block text-[11px] font-bold py-1 px-2.5 rounded-full mb-3 tracking-[0.5px] bg-[#e8f2ff] text-apple-blue">{featuredProducts[0].marketingBadge || 'HOT'}</span>
                <h3 className="text-[24px] font-bold m-0 mb-2">{featuredProducts[0].title}</h3>
                <p className="text-[16px] text-apple-gray font-medium">{formatPrice(featuredProducts[0].price)}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {featuredProducts[0].tech?.slice(0, 3).map((t, i) => (
                    <span key={i} className="text-[11px] py-1 px-2 bg-black/5 rounded-md text-[#555] font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-[60%] h-full overflow-hidden rounded-br-3xl rounded-bl-3xl z-0" style={{maskImage: 'linear-gradient(to right, transparent, black 20%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%)'}}>
                <img src={featuredProducts[0].image} alt={featuredProducts[0].title} className="w-full h-full object-cover object-top transition-transform duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105" />
              </div>
            </Link>

            <Link to={`/product/${featuredProducts[1]._id}`} className="bg-apple-lightbg rounded-3xl p-[30px] relative overflow-hidden no-underline text-apple-dark flex flex-col justify-between border border-black/5 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:z-10 group reveal md:row-span-2">
               <div className="z-10 relative">
                <span className="inline-block text-[11px] font-bold py-1 px-2.5 rounded-full mb-3 tracking-[0.5px] bg-[#f5f0ff] text-[#8944ab]">{featuredProducts[1].marketingBadge || 'NEW'}</span>
                <h3 className="text-[24px] font-bold m-0 mb-2">{featuredProducts[1].title}</h3>
                <p className="text-[16px] text-apple-gray font-medium">{formatPrice(featuredProducts[1].price)}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {featuredProducts[1].tech?.slice(0, 2).map((t, i) => (
                    <span key={i} className="text-[11px] py-1 px-2 bg-black/5 rounded-md text-[#555] font-medium">{t}</span>
                  ))}
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-full h-[60%] overflow-hidden rounded-br-3xl rounded-bl-3xl z-0">
                 <img src={featuredProducts[1].image} alt={featuredProducts[1].title} className="w-full h-full object-cover object-top transition-transform duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105" />
              </div>
            </Link>

            <Link to={`/product/${featuredProducts[2]._id}`} className="bg-apple-lightbg rounded-3xl p-[30px] relative overflow-hidden no-underline text-apple-dark flex flex-col justify-between border border-black/5 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:z-10 group reveal">
               <div className="z-10 relative">
                <span className="inline-block text-[11px] font-bold py-1 px-2.5 rounded-full mb-3 tracking-[0.5px] bg-[#fff4e6] text-[#f57f17]">{featuredProducts[2].marketingBadge || 'PRO'}</span>
                <h3 className="text-[24px] font-bold m-0 mb-2">{featuredProducts[2].title}</h3>
                <p className="text-[16px] text-apple-gray font-medium">{formatPrice(featuredProducts[2].price)}</p>
              </div>
              <div className="absolute bottom-0 right-0 w-full h-[60%] overflow-hidden rounded-br-3xl rounded-bl-3xl z-0">
                  <img src={featuredProducts[2].image} alt={featuredProducts[2].title} className="w-full h-full object-cover object-top transition-transform duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105" />
              </div>
            </Link>

             <Link to={`/product/${featuredProducts[3]._id}`} className="bg-apple-lightbg rounded-3xl p-[30px] relative overflow-hidden no-underline text-apple-dark flex flex-col justify-between border border-black/5 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:z-10 group reveal">
               <div className="z-10 relative">
                <span className="inline-block text-[11px] font-bold py-1 px-2.5 rounded-full mb-3 tracking-[0.5px] bg-[#f5f5f7] text-[#666]">{featuredProducts[3].marketingBadge || 'LITE'}</span>
                <h3 className="text-[24px] font-bold m-0 mb-2">{featuredProducts[3].title}</h3>
                <p className="text-[16px] text-apple-gray font-medium">{formatPrice(featuredProducts[3].price)}</p>
              </div>
              <div className="absolute bottom-0 right-0 w-full h-[60%] overflow-hidden rounded-br-3xl rounded-bl-3xl z-0">
                  <img src={featuredProducts[3].image} alt={featuredProducts[3].title} className="w-full h-full object-cover object-top transition-transform duration-600 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105" />
              </div>
            </Link>
          </div>
        )}
      </section>

      {/* 3. INFINITE MARQUEE */}
      <section className="reveal">
          <div className="text-center mb-5 mt-20">
           <p className="text-[12px] font-semibold text-apple-gray tracking-[0.1em] uppercase">
             ĐƯỢC TIN DÙNG BỞI HƠN 1000+ STARTUP
           </p>
        </div>
        <div className="overflow-hidden py-10 bg-white relative before:absolute before:left-0 before:top-0 before:w-[150px] before:h-full before:z-10 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:w-[150px] after:h-full after:z-10 after:bg-gradient-to-l after:from-white after:to-transparent">
            <div className="marquee-content whitespace-nowrap">
              {Array(2).fill(0).map((_, i) => (
                <React.Fragment key={i}>
                  <span className="inline-block text-[24px] font-extrabold text-[#d2d2d7] mx-10 transition-colors duration-300 hover:text-apple-dark">ACME Corp</span>
                  <span className="inline-block text-[24px] font-extrabold text-[#d2d2d7] mx-10 transition-colors duration-300 hover:text-apple-dark">Stark Ind</span>
                  <span className="inline-block text-[24px] font-extrabold text-[#d2d2d7] mx-10 transition-colors duration-300 hover:text-apple-dark">Wayne Ent</span>
                  <span className="inline-block text-[24px] font-extrabold text-[#d2d2d7] mx-10 transition-colors duration-300 hover:text-apple-dark">Cyberdyne</span>
                  <span className="inline-block text-[24px] font-extrabold text-[#d2d2d7] mx-10 transition-colors duration-300 hover:text-apple-dark">Umbrella</span>
                  <span className="inline-block text-[24px] font-extrabold text-[#d2d2d7] mx-10 transition-colors duration-300 hover:text-apple-dark">Massive Dynamic</span>
                  <span className="inline-block text-[24px] font-extrabold text-[#d2d2d7] mx-10 transition-colors duration-300 hover:text-apple-dark">Hooli</span>
                  <span className="inline-block text-[24px] font-extrabold text-[#d2d2d7] mx-10 transition-colors duration-300 hover:text-apple-dark">Pied Piper</span>
                </React.Fragment>
              ))}
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
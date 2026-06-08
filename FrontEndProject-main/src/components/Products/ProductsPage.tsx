import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CategoryNav from './components/CategoryNav';
import ProductCarousel from './components/ProductCarousel';
import { useProductList } from '../../hook/useProductList';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { all, byCategory, bestSellers, newProducts, topRatedProducts, fetchByCategory } = useProductList();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      fetchByCategory(categoryId);
    }
  };

  const displayedProducts = selectedCategory ? byCategory : all;

  return (
    <div className="min-h-screen pt-[60px] font-sans overflow-x-hidden animate-enter bg-[#f5f5f7]">
      {/* 1. Reuse Global Header */}
      <Header />

      {/* 2. Top Banner / Title */}
      <div className="pt-20 pb-10 max-w-[1400px] mx-auto px-10">
        <h1 className="text-[48px] font-bold text-apple-dark">
          Store. <span className="text-apple-gray">Món quà tuyệt vời nhất.</span>
        </h1>
      </div>

      {/* 3. Category Icons */}
      <CategoryNav onSelectCategory={handleCategorySelect} />

      {/* 4. Section: All Products or Selected Category */}
      <ProductCarousel 
        titleStart={selectedCategory ? "Selected Category." : "All Products."}
        titleHighlight={selectedCategory ? "Explore our selection." : "Discover our entire collection."}
        products={displayedProducts} 
      />

      {!selectedCategory && (
        <>
          <ProductCarousel 
            titleStart="Bán chạy nhất."
            titleHighlight="Sản phẩm được yêu thích."
            products={bestSellers} 
          />

          <ProductCarousel 
            titleStart="Mới nhất."
            titleHighlight="Công nghệ tiên tiến."
            products={newProducts} 
          />

          <ProductCarousel 
            titleStart="Đánh giá cao."
            titleHighlight="Chất lượng khẳng định."
            products={topRatedProducts} 
          />
        </>
      )}

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;

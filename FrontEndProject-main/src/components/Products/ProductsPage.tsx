import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CategoryNav from './components/CategoryNav';
import ProductCarousel from './components/ProductCarousel';
import { useProductList } from '../../hook/useProductList';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Pagination UI Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // Chỉ hiện tối đa 7 trang, dùng ellipsis
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    if (currentPage <= 4) return [...pages.slice(0, 5), -1, totalPages];
    if (currentPage >= totalPages - 3) return [1, -1, ...pages.slice(totalPages - 5)];
    return [1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages];
  };

  return (
    <div className="flex items-center justify-center gap-2 py-10">
      {/* Nút Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#e5e5ea] text-apple-dark cursor-pointer transition-all hover:bg-[#f5f5f7] hover:border-[#d2d2d7] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Trang trước"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Số trang */}
      {getVisiblePages().map((page, idx) =>
        page < 0 ? (
          <span key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-apple-gray text-[15px]">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-full text-[15px] font-medium border-none cursor-pointer transition-all duration-200 ${
              page === currentPage
                ? 'bg-apple-blue text-white shadow-[0_4px_12px_rgba(0,113,227,0.3)] scale-110'
                : 'bg-white border border-[#e5e5ea] text-apple-dark hover:bg-[#f5f5f7]'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#e5e5ea] text-apple-dark cursor-pointer transition-all hover:bg-[#f5f5f7] hover:border-[#d2d2d7] disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Trang sau"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const {
    all,
    byCategory,
    bestSellers,
    newProducts,
    topRatedProducts,
    loading,
    fetchByCategory,
    currentPage,
    totalPages,
    totalProducts,
    goToPage,
  } = useProductList();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      fetchByCategory(categoryId);
    }
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {!selectedCategory && totalProducts > 0 && (
          <p className="text-[16px] text-apple-gray mt-2">
            Hiển thị {all.length} / {totalProducts} sản phẩm • Trang {currentPage}/{totalPages}
          </p>
        )}
      </div>

      {/* 3. Category Icons */}
      <CategoryNav onSelectCategory={handleCategorySelect} />

      {/* 4. Section: All Products or Selected Category */}
      <ProductCarousel
        titleStart={selectedCategory ? "Selected Category." : "All Products."}
        titleHighlight={selectedCategory ? "Explore our selection." : "Discover our entire collection."}
        products={displayedProducts}
      />

      {/* 5. Pagination — chỉ hiện khi không lọc theo category */}
      {!selectedCategory && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProductsPage;

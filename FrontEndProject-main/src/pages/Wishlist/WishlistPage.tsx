import { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleAddToCart = async (item: any) => {

    const product = {
      id: typeof item.id === 'string' ? parseInt(item.id) : item.id,
      title: item.title,
      price: item.price,
      image: item.image,
      description: item.description,
      categoryId: item.category || '',
      discount: 0,
      sold: 0,
      createdAt: item.dateAdded
    };
    
    await addToCart(product);
  };

  const formatVND = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans">
      <Header />

      <section className="bg-black/30 text-white pt-20 pb-[60px] text-center md:pt-20 md:pb-[60px] pt-[60px] pb-10">
        <div className="max-w-[1200px] mx-auto px-5">
          <h1 className="text-[32px] md:text-[48px] font-semibold mb-4 flex items-center justify-center gap-4">
            <Heart size={28} className="text-[#ff3b30]" />
            Danh sách yêu thích của bạn
          </h1>
          <p className="text-[18px] opacity-80 max-w-[600px] mx-auto">
            {wishlistItems.length > 0 
              ? `Bạn có ${wishlistItems.length} sản phẩm trong danh sách yêu thích`
              : 'Danh sách yêu thích của bạn đang trống'
            }
          </p>
        </div>
      </section>

      <section className="py-10 md:py-[60px]">
        <div className="max-w-[1200px] mx-auto px-5">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-[30px] mt-10">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <div className="relative h-[200px] overflow-hidden group">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <button 
                      className="absolute top-3 right-3 bg-white/90 border-none rounded-full w-9 h-9 flex items-center justify-center cursor-pointer transition-all duration-300 text-[#ff3b30] hover:bg-[#ff3b30] hover:text-white hover:scale-110"
                      onClick={() => removeFromWishlist(item.id)}
                      title="Xóa khỏi danh sách yêu thích"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-[18px] font-semibold mb-3 text-apple-dark leading-[1.4]">{item.title}</h3>
                    <p className="text-[14px] text-apple-gray mb-4 leading-[1.5]">
                      {item.description?.substring(0, 100)}...
                    </p>
                    <div className="text-[20px] font-semibold text-apple-blue mb-5">{formatVND(item.price)}</div>
                    
                    <div className="flex gap-3">
                      <button 
                        className="flex-1 bg-apple-blue text-white border-none py-3 px-5 rounded-lg text-[14px] font-semibold cursor-pointer transition-colors duration-300 flex items-center justify-center gap-2 hover:bg-[#0077ed]"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag size={16} />
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-5">
              <Heart size={64} className="text-[#d2d2d7] mb-6 mx-auto" />
              <h2 className="text-[32px] font-semibold text-apple-dark mb-4">Danh sách yêu thích của bạn đang trống</h2>
              <p className="text-[16px] text-apple-gray mb-8 max-w-[400px] mx-auto">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào danh sách yêu thích nhé!</p>
              <Link to="/" className="inline-block bg-apple-blue text-white py-4 px-8 rounded-lg no-underline font-semibold transition-colors duration-300 hover:bg-[#0077ed]">
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WishlistPage;

import { useState, useRef, useEffect } from 'react';
import { HEADER_MENU, HEADER_MENU_SEARCH } from './header.data';
import MegaDropdown from './MegaDropdown';
import { useHeaderNavigation } from './hooks/useHeaderNavigation';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import useProductSearch from '../../hook/useSearch';
import { categoryService } from '../../service/categroryService';
import type { Category } from '../../types';
import { User, LogOut, Package, UserCircle, Heart } from 'lucide-react';

const Header = () => {
  const {
    scrolled,
    hoveredNavItem,
    isDropdownOpen,
    onNavItemEnter,
    onNavLeave,
  } = useHeaderNavigation();

  const { itemCount, lastAddedItem, clearLastAddedItem } = useCart();
  const { itemCount: wishlistCount, lastAddedItem: lastWishlistItem, clearLastAddedItem: clearLastWishlistItem } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [_categories, setCategories] = useState<Category[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartPopover, setShowCartPopover] = useState(false);
  const [showWishlistPopover, setShowWishlistPopover] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const popoverTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (lastAddedItem) {
      setShowCartPopover(true);
      if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
      popoverTimerRef.current = window.setTimeout(() => {
        setShowCartPopover(false);
        clearLastAddedItem();
      }, 2000);
    }
    return () => {
      if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
    };
  }, [lastAddedItem, clearLastAddedItem]);

  useEffect(() => {
    if (lastWishlistItem) {
      setShowWishlistPopover(true);
      if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
      popoverTimerRef.current = window.setTimeout(() => {
        setShowWishlistPopover(false);
        clearLastWishlistItem();
      }, 2000);
    }
    return () => {
      if (popoverTimerRef.current) clearTimeout(popoverTimerRef.current);
    };
  }, [lastWishlistItem, clearLastWishlistItem]);

  const { products: searchResults, loading: searchLoading } = useProductSearch({
    search: searchTerm,
    category: 'all',
    tech: ''
  });

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProductClick = (productId: string | number) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] h-[52px] font-sans transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${scrolled || isDropdownOpen
            ? 'bg-white/95 backdrop-blur-[18px] border-b border-black/10 shadow-[0_1px_12px_rgba(0,0,0,0.06)]'
            : 'bg-transparent border-b border-transparent'
          }`}
        onMouseLeave={onNavLeave}
      >
        <div className="max-w-[1024px] mx-auto h-full px-[22px] flex justify-between items-center relative z-20 transition-opacity duration-300">

          {/* 1. LOGO */}
          <Link to="/" className="flex items-center gap-2 no-underline cursor-pointer transition-opacity duration-300 hover:opacity-65">
            <span className="text-[19px] font-semibold tracking-[-0.02em] text-apple-dark tag-gradient">CodeStore</span>
          </Link>

          {/* 2. MAIN MENU */}
          <ul className="hidden md:flex gap-1 list-none m-0 p-0 h-full items-center">
            {HEADER_MENU.map((item) => (
              <li
                key={item.id}
                className="h-full flex items-center relative group"
                onMouseEnter={() => onNavItemEnter(item.id, item.hasDropdown)}
              >
                <Link
                  to={item.path || '#'}
                  className={`text-[12px] font-normal no-underline px-3 py-2 rounded-lg transition-all duration-300 ${hoveredNavItem === item.id ? 'opacity-100 bg-black/5 text-black' : 'opacity-80 text-apple-dark group-hover:opacity-100 group-hover:bg-black/5 group-hover:text-black'
                    }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* 3. RIGHT ACTIONS */}
          <div className="flex items-center gap-4">
            <button className="bg-transparent border-none p-2 rounded-full cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-black/5 group" onClick={toggleSearch}>
              <img src="/search_button.svg" alt="Search" className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
            </button>

            {/* Cart Button */}
            <div className="relative">
              <Link to="/cart" className="bg-transparent border-none p-2 rounded-full cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-black/5 group">
                <img src="/cart.svg" alt="Cart" className="w-5 h-5 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
                {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-apple-error text-white text-[10px] font-semibold px-[5px] py-[2px] rounded-full min-w-[16px] text-center leading-none">{itemCount}</span>}
              </Link>

              {/* Cart Popover */}
              <div className={`absolute top-[calc(100%+15px)] -right-5 w-[320px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-black/10 p-4 z-[1500] transition-all duration-300 text-apple-dark ${showCartPopover ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2.5'
                }`}>
                {lastAddedItem && (
                  <>
                    <div className="text-[14px] font-semibold pb-3 border-b border-apple-border mb-3">Đã thêm vào giỏ hàng</div>
                    <div className="flex items-center gap-3">
                      <img src={lastAddedItem.image} alt={lastAddedItem.title} className="w-[50px] h-[50px] object-cover rounded-md border border-[#e8e8e8]" />
                      <span className="text-[14px] leading-snug flex-1">{lastAddedItem.title}</span>
                    </div>
                    <div className="mt-4 border-t border-apple-border pt-3">
                      <Link to="/cart" className="block w-full text-center bg-apple-blue hover:bg-[#0077ed] text-white p-2.5 rounded-lg text-[15px] font-semibold no-underline transition-colors duration-200">
                        Xem giỏ hàng ({itemCount})
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Wishlist Button */}
            <div className="relative">
              <Link to="/wishlist" className="bg-transparent border-none p-2 rounded-full cursor-pointer flex items-center justify-center transition-colors duration-200 hover:bg-black/5 group text-apple-dark hover:text-apple-error">
                <Heart size={20} className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200" />
                {wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-apple-error text-white text-[10px] font-semibold px-[5px] py-[2px] rounded-full min-w-[16px] text-center leading-none">{wishlistCount}</span>}
              </Link>

              {/* Wishlist Popover */}
              <div className={`absolute top-[calc(100%+15px)] -right-5 w-[320px] bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] border border-black/10 p-4 z-[1500] transition-all duration-300 text-apple-dark ${showWishlistPopover ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2.5'
                }`}>
                {lastWishlistItem && (
                  <>
                    <div className="text-[14px] font-semibold pb-3 border-b border-apple-border mb-3">Đã thêm vào yêu thích</div>
                    <div className="flex items-center gap-3">
                      <img src={lastWishlistItem.image} alt={lastWishlistItem.title} className="w-[50px] h-[50px] object-cover rounded-md border border-[#e8e8e8]" />
                      <span className="text-[14px] leading-snug flex-1">{lastWishlistItem.title}</span>
                    </div>
                    <div className="mt-4 border-t border-apple-border pt-3">
                      <Link to="/wishlist" className="block w-full text-center bg-apple-error hover:bg-[#ff453a] text-white p-2.5 rounded-lg text-[15px] font-semibold no-underline transition-colors duration-200">
                        Xem danh sách yêu thích ({wishlistCount})
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* User Auth */}
            <div
              className="relative h-full flex items-center ml-4"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 cursor-pointer text-apple-dark text-[14px] font-medium py-1 group">
                  <span className="hidden md:inline">Hi, {user.name}</span>
                  <UserCircle size={24} className="text-[#555] group-hover:text-apple-blue transition-colors duration-300" />

                  <div className={`absolute top-full -right-2.5 w-[240px] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] py-2.5 border border-black/5 z-[1000] transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${showUserMenu ? 'opacity-100 visible translate-y-[15px]' : 'opacity-0 invisible translate-y-2.5'
                    }`}>
                    <div className="absolute -top-1.5 right-5 w-3 h-3 bg-white rotate-45 border-t border-l border-black/5"></div>
                    <div className="px-5 py-2.5 border-b border-[#f0f0f0] mb-1">
                      <p className="font-semibold text-apple-dark m-0 text-[15px]">{user.name}</p>
                      <p className="text-[12px] text-apple-gray m-0 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{user.email}</p>
                    </div>

                    <ul className="list-none p-0 m-0">
                      <li>
                        <Link to="/account/home" className="flex items-center gap-2.5 px-5 py-2.5 text-[#424245] text-[14px] no-underline w-full hover:bg-apple-lightbg hover:text-apple-blue transition-colors">
                          <User size={16} /> Thông tin tài khoản
                        </Link>
                      </li>
                      {user.role === 'buyer' && (
                        <li>
                          <Link to="/account/home" className="flex items-center gap-2.5 px-5 py-2.5 text-[#424245] text-[14px] no-underline w-full hover:bg-apple-lightbg hover:text-apple-blue transition-colors">
                            <Package size={16} /> Đơn hàng của tôi
                          </Link>
                        </li>
                      )}
                      {user.role === 'admin' && (
                        <li>
                          <Link to="/admin" className="flex items-center gap-2.5 px-5 py-2.5 text-[#424245] text-[14px] no-underline w-full hover:bg-apple-lightbg hover:text-apple-blue transition-colors">
                            <Package size={16} /> Quản trị viên
                          </Link>
                        </li>
                      )}
                      {user.role === 'seller' && (
                        <li>
                          <Link to="/seller" className="flex items-center gap-2.5 px-5 py-2.5 text-[#424245] text-[14px] no-underline w-full hover:bg-apple-lightbg hover:text-apple-blue transition-colors">
                            <Package size={16} /> Kênh người bán
                          </Link>
                        </li>
                      )}
                      <li className="h-px bg-[#f0f0f0] my-1"></li>
                      <li>
                        <button onClick={logout} className="flex items-center gap-2.5 px-5 py-2.5 text-[#d32f2f] text-[14px] w-full text-left bg-transparent border-none cursor-pointer hover:bg-[#fff0f0] hover:text-[#b71c1c] transition-colors">
                          <LogOut size={16} /> Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="bg-apple-blue text-white border-none py-1 px-3.5 rounded-full text-[11px] font-medium cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#0077ed] hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,113,227,0.25)] active:scale-95 no-underline">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 4. MEGA DROPDOWN */}
        <MegaDropdown visible={isDropdownOpen} />

        {/* 5. SEARCH DROPDOWN */}
        <div className={`absolute top-[52px] left-0 right-0 bg-white/98 backdrop-blur-[20px] border-b-4 border-black/10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] rounded-lg overflow-hidden z-10 flex justify-center items-start transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isSearchOpen ? 'visible h-[340px] opacity-100 delay-0' : 'invisible h-0 opacity-0 delay-500'
          }`}>
          <div className={`w-full max-w-[680px] py-5 flex flex-col gap-5 transition-all duration-400 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isSearchOpen ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 -translate-y-2.5'
            }`}>
            <div className="flex items-center gap-3 pb-2.5">
              <img className="w-5 h-5 opacity-50" src="/search_button.svg" alt="Search" />
              <input
                ref={searchInputRef}
                type="text"
                className="flex-1 border-none outline-none text-[24px] font-semibold text-apple-dark bg-transparent placeholder-apple-gray"
                placeholder="Tìm kiếm trên CodeStore"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="max-h-[250px] overflow-y-auto pr-2.5 scrollbar-thin scrollbar-thumb-[#d1d1d6] scrollbar-track-transparent">
              {searchLoading ? (
                <div className="text-[14px] text-apple-gray text-center py-5">Đang tìm kiếm...</div>
              ) : searchTerm ? (
                searchResults.length > 0 ? (
                  <div>
                    <h4 className="text-[12px] text-apple-gray mb-2.5 font-normal">Gợi ý sản phẩm</h4>
                    <ul className="list-none p-0 m-0">
                      {searchResults.filter(product => product.price && !isNaN(Number(product.price)))
                        .map((product) => (
                          <li key={product._id || product.id} className="mb-2">
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleProductClick(product._id || product.id as string | number);
                              }}
                              className="flex justify-between items-center no-underline text-[14px] text-apple-dark font-medium py-2 px-3 rounded-lg transition-colors duration-200 hover:bg-black/5 hover:text-apple-blue"
                            >
                              {product.title}
                              <span className="text-[13px] text-apple-gray font-normal">
                                {product.price && !isNaN(Number(product.price))
                                  ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))
                                  : 'Liên hệ'
                                }
                              </span>
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-[14px] text-apple-gray text-center py-5">Không tìm thấy sản phẩm nào</div>
                )
              ) : (
                <div>
                  <h4 className="text-[12px] text-apple-gray mb-2.5 font-normal">Danh mục nổi bật</h4>
                  <ul className="list-none p-0 m-0">
                    {HEADER_MENU_SEARCH.map((item) => (
                      <li
                        key={item.id}
                        className="mb-2"
                        onMouseEnter={() => onNavItemEnter(item.id, item.hasDropdown)}
                      >
                        <Link to={item.path || '#'} className="no-underline text-[14px] text-apple-dark font-medium transition-colors duration-200 hover:text-apple-blue">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* BACKDROP */}
      <div
        className={`fixed top-[52px] left-0 right-0 bottom-0 bg-black/20 backdrop-blur-[2px] z-[9997] transition-opacity duration-300 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={onNavLeave}
      ></div>

      <div
        className={`fixed top-[52px] left-0 right-0 bottom-0 bg-black/40 backdrop-blur-[4px] z-[9998] transition-opacity duration-300 ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={toggleSearch}
      ></div>
    </>
  );
};

export default Header;

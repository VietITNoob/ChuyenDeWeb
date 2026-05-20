import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Code, Layers, Loader2, ShoppingBag } from 'lucide-react'; 
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../service/orderService';
import type { Order } from '../../types';

const UserProfilePage = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      orderService.getMyOrders()
        .then((data) => {
          const sortedOrders = data.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sortedOrders);
        })
        .catch(err => console.error("Lỗi tải đơn hàng:", err))
        .finally(() => setIsOrdersLoading(false));
    }
  }, [user]);

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#f5f5f7]">
        <Loader2 className="animate-spin text-apple-gray" size={40} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pb-[60px] font-sans text-apple-dark bg-white">
      <Header />

      <div className="max-w-[980px] mx-auto px-5 animate-enter pt-[60px]">
        {/* --- HEADER GREETING --- */}
        <div className="pt-[50px] pb-10 border-b border-[#e5e5e5] mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold m-0 tracking-[-0.01em]">Hi, {user.name || "Developer"}.</h1>
            <p className="text-[16px] text-apple-gray mt-1.5">{user.email}</p>
          </div>
          <button onClick={logout} className="text-[14px] text-apple-blue bg-transparent border-none cursor-pointer p-0 hover:underline">Sign out &rsaquo;</button>
        </div>

        {/* --- SECTION: ORDERS --- */}
        <div className="text-2xl font-semibold mb-2">Your Orders</div>
        <div className="text-[15px] text-apple-gray mb-[25px]">
          Manage your purchased source codes, invoices, and download links.
        </div>

        {/* --- RENDER LOGIC: LOADING / EMPTY / LIST --- */}
        {isOrdersLoading ? (
           <div className="p-10 text-center text-apple-gray">
              Loading your orders...
           </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-[60px]">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[18px] p-6 flex flex-col relative overflow-hidden transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
                
                {/* Card Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex flex-col">
                    <span className="text-[13px] text-apple-gray font-medium">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span className="text-[15px] font-semibold text-apple-dark mt-0.5">#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <span className={`text-[12px] font-semibold py-1 px-2.5 rounded-full ${order.isPaid ? 'text-[#008800] bg-[#e8f5e9]' : 'text-[#ff9500] bg-[#fff3e0]'}`}>
                    {order.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </span>
                </div>

                {/* Card Body: Items Preview */}
                <div className="flex gap-2.5 mb-[15px]">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="w-[60px] h-[60px] rounded-xl overflow-hidden border border-[#f0f0f0] bg-[#f9f9f9]" title={item.title}>
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {/* Badge số lượng nếu > 3 sản phẩm */}
                  {order.orderItems.length > 3 && (
                    <div className="w-[60px] h-[60px] rounded-xl bg-[#f5f5f7] flex items-center justify-center text-[14px] font-semibold text-apple-gray">
                      +{order.orderItems.length - 3}
                    </div>
                  )}
                </div>

                {/* Card Content: Summary */}
                <div className="mt-auto mb-[15px]">
                   <div className="flex justify-between items-end mb-1">
                      <span className="text-[13px] text-apple-gray">
                          {order.orderItems.length} product{order.orderItems.length > 1 ? 's' : ''}
                      </span>
                      <span className="text-[16px] font-bold text-apple-dark">
                          {formatCurrency(order.totalPrice)}
                      </span>
                   </div>
                   <div className="text-[13px] text-apple-gray whitespace-nowrap overflow-hidden text-ellipsis">
                      {order.orderItems.map(i => i.title).join(', ')}
                   </div>
                </div>

                <div className="border-t border-[#f0f0f0] pt-[15px]">
                  <a href={`/orders/${order._id}`} className="text-[14px] text-apple-blue font-medium no-underline inline-flex items-center gap-0.5 hover:underline">
                    View Order Details <ChevronRight size={12} className="inline"/>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // EMPTY STATE
          <div className="bg-white rounded-[18px] p-[60px] text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-[60px]">
              <ShoppingBag size={48} className="text-[#d2d2d7] mb-5 mx-auto" />
              <h3 className="text-[20px] font-semibold mb-2.5">No orders yet</h3>
              <p className="text-apple-gray mb-5">
                You haven't purchased any source code yet. Start exploring now!
              </p>
              <a href="/" className="text-[16px] text-apple-blue font-medium no-underline inline-flex items-center gap-0.5 hover:underline">
                 Browse Store <ChevronRight size={16} />
              </a>
          </div>
        )}

        <div className="border-t border-[#d2d2d7] my-10"></div>

        {/* --- SECTION: INFO & WISHLIST --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Account Settings */}
          <div className="bg-white rounded-[18px] p-[30px] min-h-[220px] flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="w-10 h-10 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-[15px]">
                <Layers size={24} color="#1d1d1f" />
            </div>
            <h3 className="text-[20px] font-semibold m-0 mb-2">Account Settings</h3>
            <p className="text-[15px] text-apple-gray leading-snug mb-5">Manage your developer profile, billing address, and security.</p>
            
            <div className="mt-auto">
                <div className="flex justify-between border-b border-[#f0f0f0] py-2.5 text-[14px]">
                    <span className="text-apple-gray">Name</span>
                    <span className="font-medium text-[#1d1d1f]">{user.name}</span>
                </div>
                <div className="flex justify-between border-b border-[#f0f0f0] py-2.5 text-[14px]">
                    <span className="text-apple-gray">Email</span>
                    <span className="font-medium text-[#1d1d1f]">{user.email}</span>
                </div>
                {user.phone && (
                    <div className="flex justify-between py-2.5 text-[14px]">
                        <span className="text-apple-gray">Phone</span>
                        <span className="font-medium text-[#1d1d1f]">{user.phone}</span>
                    </div>
                )}
                <a href="/profile/edit" className="text-[15px] text-apple-blue font-medium no-underline inline-flex items-center gap-0.5 mt-[15px] hover:underline">
                  Edit Profile <ChevronRight size={14} className="inline align-middle"/>
                </a>
            </div>
          </div>

          {/* Saved Items */}
          <div className="bg-white rounded-[18px] p-[30px] min-h-[220px] flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="w-10 h-10 bg-[#f5f5f7] rounded-full flex items-center justify-center mb-[15px]">
                <Code size={24} color="#1d1d1f" />
            </div>
            <h3 className="text-[20px] font-semibold m-0 mb-2">Your Snippets & Saves</h3>
            <p className="text-[15px] text-apple-gray leading-snug mb-5">
                Access your saved libraries, UI kits, and snippets for later purchase.
            </p>
            <div className="mt-auto">
                 <a href="/wishlist" className="text-[15px] text-apple-blue font-medium no-underline inline-flex items-center gap-0.5 hover:underline">
                    Go to Wishlist <ChevronRight size={14} className="inline align-middle"/>
                 </a>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserProfilePage;
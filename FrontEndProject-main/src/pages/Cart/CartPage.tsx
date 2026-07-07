import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../service/orderService';
import { paymentService } from '../../service/paymentService';
import { voucherService } from '../../service/voucherService';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'VNPay'>('VNPay');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discountAmount: number } | null>(null);
  const [voucherMessage, setVoucherMessage] = useState('');

  // --- POPUP STATES ---
  const [showPopup, setShowPopup] = useState(false);
  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalPrice = Math.max(totalPrice - (appliedVoucher?.discountAmount || 0), 0);
  const formatVND = (price: number) => price.toLocaleString('vi-VN') + 'đ';

  const handleApplyVoucher = async () => {
    setVoucherMessage('');
    setAppliedVoucher(null);

    if (!voucherCode.trim()) {
      setVoucherMessage('Vui lòng nhập mã voucher.');
      return;
    }

    try {
      const productIds = cartItems.map((item) => String(item._id || item.id));
      const result = await voucherService.validateVoucher(voucherCode, productIds);
      const matchedSet = new Set(result.matchedProducts.map(String));
      const applicableTotal = cartItems
        .filter((item) => matchedSet.has(String(item._id || item.id)))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discountAmount = result.voucher.discountType === 'percent'
        ? Math.round(applicableTotal * result.voucher.discountValue / 100)
        : Math.min(result.voucher.discountValue, applicableTotal);

      setAppliedVoucher({ code: result.voucher.code, discountAmount });
      setVoucherMessage(`Đã áp dụng voucher ${result.voucher.code}.`);
    } catch (error: any) {
      setVoucherMessage(error.response?.data?.message || 'Voucher không hợp lệ.');
    }
  };

  const showNotification = (status: 'success' | 'error', message: string, redirectPath?: string) => {
    setPopupStatus(status);
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      if (redirectPath) navigate(redirectPath);
    }, status === 'success' ? 2000 : 3000);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      showNotification('error', 'Vui lòng đăng nhập để tiến hành thanh toán!', '/login');
      return;
    }

    if (user.role !== 'buyer') {
      showNotification('error', 'Tài khoản admin hoặc người bán không được mua hàng.');
      return;
    }

    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      const orderItems = cartItems.map(item => ({
        product: item._id || item.id as string,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '',
      }));

      const createdOrder = await orderService.createOrder({
        orderItems,
        paymentMethod,
        totalPrice: finalPrice,
        voucherCode: appliedVoucher?.code,
      });

      if (paymentMethod === 'VNPay') {
        const paymentResult = await paymentService.createPaymentUrl({
          orderId: createdOrder._id,
          orderInfo: `Thanh toan don hang CodeStore #${createdOrder._id}`,
          amount: createdOrder.totalPrice,
        });

        clearCart();
        window.location.href = paymentResult.paymentUrl;
        return;
      }

      clearCart();
      showNotification('success', 'Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', '/account/home');

    } catch (error: any) {
      console.error("Checkout Error:", error);
      const msg = error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.';
      showNotification('error', msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-apple-dark pt-[60px]">
      <Header />

      {/* --- CUSTOM POPUP --- */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[9999] animate-[fadeIn_0.3s_ease]">
          <div className="bg-white p-10 rounded-3xl text-center w-[90%] max-w-[400px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] animate-[popUp_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
            <div className="mb-5 flex justify-center">
              {popupStatus === 'success' ? (
                <CheckCircle size={48} color="#34c759" />
              ) : (
                <XCircle size={48} color="#ff3b30" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2.5 text-apple-dark">
              {popupStatus === 'success' ? 'Thành Công!' : 'Thông Báo'}
            </h3>
            <p className="text-base text-apple-gray leading-relaxed">{popupMessage}</p>
          </div>
        </div>
      )}

      <section className="text-center py-20 px-5 bg-[#f5f5f7] border-b border-[#d2d2d7] mb-10">
        <h1 className="text-[40px] leading-[1.1] font-bold max-w-[800px] mx-auto mb-6 tracking-[-0.005em]">
          Tổng giá trị giỏ hàng của bạn là <span className="font-bold text-apple-dark">{formatVND(finalPrice)}.</span>
        </h1>
        <p className="text-[17px] text-apple-dark mb-6">Vận chuyển miễn phí (Gửi qua Email ngay lập tức).</p>
        <button 
          className="bg-apple-blue text-white text-[17px] font-semibold py-3 px-[60px] rounded-xl border-none cursor-pointer transition-all duration-200 hover:bg-[#0077ed] hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={handleCheckout} 
          disabled={isProcessing || cartItems.length === 0}
        >
          {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
        </button>
      </section>

      <section className="max-w-[980px] mx-auto px-[22px]">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row py-[60px] border-b border-[#d2d2d7] gap-10 md:items-start items-center text-center md:text-left">
              <img src={item.image} alt={item.title} className="w-[200px] h-[200px] object-contain" />

              <div className="flex-1 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-2.5 gap-2.5 md:gap-0">
                  <h3 className="text-2xl font-semibold m-0 text-apple-dark">{item.title}</h3>
                  <span className="text-2xl font-semibold text-apple-dark">{formatVND(item.price)}</span>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2.5">
                   <span className="text-[17px] font-normal">SL:</span>
                   <div className="flex items-center text-[17px] font-semibold">
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 border-none cursor-pointer transition-colors hover:bg-black/10 disabled:opacity-50"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 border-none cursor-pointer transition-colors hover:bg-black/10"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                   </div>
                </div>

                <div className="mt-auto pt-5 flex justify-center md:justify-end">
                  <button onClick={() => removeFromCart(item.id)} className="bg-transparent border-none text-apple-blue text-[15px] cursor-pointer hover:underline">Xóa</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-apple-gray mb-8">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào giỏ hàng nhé!</p>
            <Link to="/" className="inline-block bg-apple-blue text-white font-medium py-3 px-6 rounded-full no-underline hover:bg-[#0077ed] transition-colors">
              Tiếp tục mua sắm
            </Link>
          </div>
        )}
      </section>

      {cartItems.length > 0 && (
        <section className="max-w-[980px] mx-auto mt-[60px] mb-[100px] px-[22px]">
          <div className="flex justify-between mb-4 text-[17px]">
            <span className="text-apple-dark">Tổng phụ</span>
            <span className="text-apple-dark">{formatVND(totalPrice)}</span>
          </div>
          <div className="mb-4 rounded-xl border border-[#d2d2d7] p-4">
            <div className="text-[14px] font-semibold text-apple-dark mb-2">Mã voucher</div>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                value={voucherCode}
                onChange={(event) => {
                  setVoucherCode(event.target.value.toUpperCase());
                  setAppliedVoucher(null);
                }}
                placeholder="Nhập mã voucher"
                className="flex-1 rounded-xl border border-[#d2d2d7] px-4 py-3 outline-none focus:border-apple-blue"
              />
              <button type="button" onClick={handleApplyVoucher} className="rounded-xl bg-[#1d1d1f] text-white px-5 py-3 font-semibold">
                Áp dụng
              </button>
            </div>
            {voucherMessage && <div className="text-[13px] text-apple-gray mt-2">{voucherMessage}</div>}
          </div>
          {appliedVoucher && (
            <div className="flex justify-between mb-4 text-[17px]">
              <span className="text-apple-dark">Giảm giá ({appliedVoucher.code})</span>
              <span className="text-[#1e8e3e]">-{formatVND(appliedVoucher.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between mb-4 text-[17px]">
            <span className="text-apple-dark">Vận chuyển (Email)</span>
            <span className="text-apple-dark">MIỄN PHÍ</span>
          </div>

          <div className="h-px bg-[#d2d2d7] my-5"></div>

          <div className="flex flex-col md:flex-row justify-between items-end mt-2.5">
            <span className="text-2xl font-semibold">Thanh toán toàn bộ</span>
            <span className="text-4xl font-bold tracking-[-0.02em]">{formatVND(finalPrice)}</span>
          </div>

          {/* --- CHỌN PHƯƠNG THỨC THANH TOÁN --- */}
          <div className="mt-5 mb-2.5 text-right md:text-left">
            <div className="text-[14px] font-semibold text-apple-dark mb-2.5 text-left">
              Phương thức thanh toán
            </div>
            <div className="flex gap-2.5 flex-col md:flex-row">
              <button
                onClick={() => setPaymentMethod('VNPay')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold text-[14px] cursor-pointer transition-all duration-200 ${paymentMethod === 'VNPay' ? 'border-apple-blue bg-[#e8f0fe] text-apple-blue' : 'border-[#d2d2d7] bg-white text-apple-dark'}`}
              >
                💳 VNPay
              </button>
              <button
                onClick={() => setPaymentMethod('COD')}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-semibold text-[14px] cursor-pointer transition-all duration-200 ${paymentMethod === 'COD' ? 'border-apple-blue bg-[#e8f0fe] text-apple-blue' : 'border-[#d2d2d7] bg-white text-apple-dark'}`}
              >
                📦 Thanh toán sau (COD)
              </button>
            </div>
          </div>

          <div className="text-right text-[14px] text-apple-gray mt-2">
             hoặc
             <div className="text-[17px] font-semibold mt-1 text-apple-dark">
                Thanh toán Hàng Tháng {formatVND(Math.round(finalPrice / 12))}/tháng*
             </div>
             <div className="mt-1 text-[12px]">Lãi suất 0% trong 12 tháng. <a href="#" className="text-apple-blue hover:underline">Tìm hiểu thêm</a></div>
          </div>

        <div className="mt-10 text-right">
           <button
                className="bg-apple-blue text-white text-[17px] font-normal py-[18px] px-[60px] rounded-xl border-none cursor-pointer w-full max-w-[400px] transition-colors hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={isProcessing}
           >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> Đang xử lý...
                  </span>
                ) : (
                  paymentMethod === 'VNPay' ? '💳 Thanh Toán VNPay' : '📦 Đặt Hàng (COD)'
                )}
             </button>
          </div>
        </section>
      )}

      <section className="bg-white py-[60px] pb-[100px] border-t border-[#d2d2d7]">
        <h2 className="text-center text-[32px] font-semibold mb-10">Có thể bạn cũng sẽ thích</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] max-w-[980px] mx-auto px-[22px]">
           <div className="text-center p-5">
              <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&q=80" className="w-[100px] h-[100px] object-contain mb-4 mx-auto" alt="UI Kit"/>
              <div className="text-[17px] font-semibold text-apple-blue mb-1 cursor-pointer hover:underline">Glassmorphism UI Kit</div>
              <div className="text-[14px] text-apple-dark">699.000đ</div>
           </div>
           <div className="text-center p-5">
              <img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&q=80" className="w-[100px] h-[100px] object-contain mb-4 mx-auto" alt="Icons"/>
              <div className="text-[17px] font-semibold text-apple-blue mb-1 cursor-pointer hover:underline">3D Abstract Icons</div>
              <div className="text-[14px] text-apple-dark">299.000đ</div>
           </div>
           <div className="text-center p-5">
              <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=200&q=80" className="w-[100px] h-[100px] object-contain mb-4 mx-auto" alt="Theme"/>
              <div className="text-[17px] font-semibold text-apple-blue mb-1 cursor-pointer hover:underline">VS Code Pro Theme</div>
              <div className="text-[14px] text-apple-dark">199.000đ</div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CartPage;

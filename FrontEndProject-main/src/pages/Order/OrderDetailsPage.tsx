import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Download,
  Printer,
  Key,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { orderService } from '../../service/orderService';
import type { Order } from '../../types';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orders = await orderService.getMyOrders();
        const found = orders.find(o => o._id === id);
        if (!found) throw new Error('Không tìm thấy đơn hàng.');
        setOrder(found);
      } catch (err) {
        console.error(err);
        setError('Không thể tải thông tin đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const formatCurrency = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleDownload = (itemTitle: string, downloadUrl?: string) => {
    setDownloadingId(itemTitle);

    setTimeout(() => {
      if (downloadUrl && downloadUrl !== 'https://res.cloudinary.com/demo/raw/upload/sample.zip') {
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${itemTitle}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const fileContent = `
DỰ ÁN: ${itemTitle}
PHIÊN BẢN: v1.0.0
LICENSE: Personal Use

Cảm ơn bạn đã mua hàng tại CodeStore!
Đây là file demo. Trong dự án thực tế, đây sẽ là file .zip chứa source code.
        `;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${itemTitle.replace(/\s+/g, '_')}_Source.txt`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
      setDownloadingId(null);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-[#f5f5f7]">
        <Loader2 className="animate-spin text-[#86868b]" size={40} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex h-screen justify-center items-center bg-[#f5f5f7]">
        <div className="text-center">
          <AlertCircle size={50} className="text-[#ff3b30] mb-5 mx-auto block" />
          <h2 className="mb-2.5 text-2xl font-semibold">Không tìm thấy đơn hàng</h2>
          <p className="text-[#86868b] mb-5">{error}</p>
          <button onClick={() => navigate('/account/home')} className="px-5 py-2.5 rounded-lg border-none bg-apple-blue text-white cursor-pointer font-medium hover:bg-[#0077ed]">
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 font-sans text-apple-dark bg-white print:m-0 print:p-0">
      {/* In hóa đơn header */}
      <div className="hidden print:block mb-8">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl font-bold m-0 print:text-black">CODE STORE.</h1>
            <p className="text-xs text-[#666]">Giải pháp Source Code chất lượng cao</p>
          </div>
          <div className="text-right text-xs text-[#666]">
            <p>Hotline: 0909.565.204</p>
            <p>Email: support@codestore.com</p>
            <p>Website: www.codestore.vn</p>
          </div>
        </div>
        <hr className="border-none border-t border-[#ddd] mb-[30px]" />
      </div>

      <div className="print:hidden">
        <Header />
      </div>

      <div className="max-w-[980px] mx-auto px-5 print:max-w-full print:p-0">
        <div className="pt-10 mb-5 print:hidden">
          <div className="inline-flex items-center text-apple-gray text-[14px] cursor-pointer transition-colors hover:text-apple-blue" onClick={() => navigate('/account/home')}>
            <ChevronLeft size={16} /> Quay lại danh sách đơn hàng
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-end mb-[30px] gap-4 md:gap-0 print:flex-col print:items-start">
          <div>
            <h1 className="text-[32px] md:text-[40px] font-bold m-0 tracking-[-0.5px] print:text-2xl print:text-black">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <div className="text-apple-gray text-[16px] mt-1.5 print:text-[#555]">Đặt ngày {new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
          </div>
          <div className="flex gap-[15px] print:hidden">
            <button className="py-2 px-4 rounded-full border border-[#d2d2d7] bg-transparent text-apple-blue text-[14px] font-medium cursor-pointer flex items-center gap-1.5 transition-all hover:bg-apple-blue/5 hover:border-apple-blue" onClick={() => window.print()}>
              <Printer size={16} /> In hóa đơn
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5 mb-6 bg-white py-4 px-5 rounded-xl border border-[#e5e5e5] print:border-none print:p-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#008800] print:hidden"></div>
          <div className="flex-1">
            <span className="font-semibold text-[#008800]">{order.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}</span>
            <span className="mx-2 text-[#ccc]">|</span>
            <span className="text-apple-gray text-[14px]">{order.paymentMethod}</span>
          </div>
          {order.isPaid && <CheckCircle2 size={20} color="#008800" className="print:hidden" />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 print:block">
          <div className="print:w-full print:mb-5">
            <div className="bg-white rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-[30px] print:shadow-none print:border print:border-[#eee] print:rounded-none print:break-inside-avoid">
              <div className="text-[20px] font-semibold mb-5 pb-4 border-b border-[#f0f0f0] print:text-[18px] print:mb-[15px] print:pb-2.5 print:border-[#ddd]">Sản phẩm đã mua</div>

              {order.orderItems.map((item, index) => (
                <div key={index} className="flex gap-5 py-5 border-b border-[#f0f0f0] last:border-b-0 last:pb-0 print:border-dashed print:border-[#ddd]">
                  <img src={item.image} alt={item.title} className="w-[80px] h-[80px] rounded-xl object-cover border border-[#f0f0f0] print:hidden" />

                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-[17px] font-semibold m-0 mb-1 text-apple-dark">{item.title}</div>
                    <div className="text-[13px] text-apple-gray mb-2">
                      <span className="inline-block text-[11px] font-semibold text-white bg-black py-0.5 px-1.5 rounded mr-1.5">STANDARD</span> v1.0.0
                    </div>

                    <div className="mt-2.5 flex gap-[15px] items-center print:hidden">
                      <a
                        href="#"
                        className="text-[13px] text-apple-blue no-underline flex items-center gap-1 cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          if (downloadingId !== item.title) handleDownload(item.title);
                        }}
                        style={{
                          opacity: downloadingId === item.title ? 0.7 : 1,
                          cursor: downloadingId === item.title ? 'wait' : 'pointer'
                        }}
                      >
                        {downloadingId === item.title ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Download size={14} />
                        )}
                        {downloadingId === item.title ? ' Đang tải...' : ' Tải Source Code'}
                      </a>

                      <span className="text-[13px] text-apple-blue flex items-center gap-1 cursor-pointer hover:underline" onClick={() => alert(`License Key: CSKEY-${item.product.slice(-6).toUpperCase()}`)}>
                        <Key size={14} /> License Key
                      </span>
                    </div>
                  </div>

                  <div className="text-[16px] font-medium text-right min-w-[100px]">
                    {formatCurrency(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="print:w-full print:mb-5">
            <div className="bg-white rounded-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-[30px] print:shadow-none print:border print:border-[#eee] print:rounded-none print:break-inside-avoid">
              <div className="text-[20px] font-semibold mb-5 pb-4 border-b border-[#f0f0f0] print:text-[18px] print:mb-[15px] print:pb-2.5 print:border-[#ddd]">Tóm tắt</div>
              <div className="mt-[15px] pt-[15px] border-t border-[#f0f0f0] flex justify-between items-center">
                <span className="text-[17px] font-semibold">Tổng cộng</span>
                <span className="text-[24px] font-bold">{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="mt-5">
                <h4 className="text-[15px] m-0 mb-1">Thanh toán</h4>
                <p className="text-[#666] m-0 text-[14px]">{order.paymentMethod}</p>
              </div>
              <div className="mt-3">
                <h4 className="text-[15px] m-0 mb-1">Trạng thái</h4>
                <p className={`font-semibold m-0 text-[14px] ${order.isPaid ? 'text-[#008800]' : 'text-[#ff9500]'}`}>
                  {order.isPaid ? '✅ Đã thanh toán' : '⏳ Chờ thanh toán'}
                </p>
                {order.paidAt && (
                  <p className="text-[#86868b] text-[13px] m-0 mt-1">
                    Lúc {new Date(order.paidAt).toLocaleString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
import React, { useEffect, useState } from 'react';
import { Loader2, ShoppingBag, Eye, Calendar, User, Tag } from 'lucide-react';
import { adminService } from '../../../service/adminService';

interface OrderItem {
  product: {
    _id: string;
    title: string;
    price: number;
    seller: string;
  };
  title: string;
  price: number;
  quantity: number;
}

interface AdminOrder {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  orderItems: OrderItem[];
  paymentMethod: string;
  voucherCode?: string;
  discountAmount?: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
}

const formatMoney = (value: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(value || 0);

const AdminOrderManager: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const buyerName = order.user?.name || '';
    const buyerEmail = order.user?.email || '';
    const orderId = order._id || '';

    const matchesSearch = 
      buyerName.toLowerCase().includes(search.toLowerCase()) ||
      buyerEmail.toLowerCase().includes(search.toLowerCase()) ||
      orderId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'paid' && order.isPaid) ||
      (statusFilter === 'pending' && !order.isPaid);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center p-[60px]">
        <Loader2 className="animate-spin text-apple-blue" size={32} />
      </div>
    );
  }

  if (error) {
    return <div className="text-[#ff3b30] p-5 bg-white border border-[#ffd0d0] rounded-xl">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white border border-[#e5e5ea] rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn, tên hoặc email khách hàng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:max-w-md px-4 py-2.5 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] focus:bg-white text-[14px] outline-none transition-all focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20"
        />
        <div className="flex gap-2 w-full md:w-auto">
          {(['all', 'paid', 'pending'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-apple-blue text-white shadow-sm'
                  : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e5e5ea]'
              }`}
            >
              {filter === 'all' ? 'Tất cả' : filter === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Orders Table/List */}
        <div className="bg-white border border-[#e5e5ea] rounded-2xl p-5 overflow-x-auto xl:col-span-2 shadow-sm">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-[60px] text-apple-gray">
              <ShoppingBag size={48} className="mx-auto" />
              <h3 className="text-apple-dark mt-4 mb-2 text-[16px] font-semibold">Không tìm thấy đơn hàng nào</h3>
            </div>
          ) : (
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#e5e5ea]">
                  <th className="p-3 font-semibold text-apple-gray">Mã đơn</th>
                  <th className="p-3 font-semibold text-apple-gray">Khách hàng</th>
                  <th className="p-3 font-semibold text-apple-gray">Tổng tiền</th>
                  <th className="p-3 font-semibold text-apple-gray">Trạng thái</th>
                  <th className="p-3 font-semibold text-apple-gray">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#f2f2f2] last:border-b-0 hover:bg-[#f9f9fb] transition-colors">
                    <td className="p-3 text-[13px] font-medium text-apple-dark">
                      #{order._id?.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-apple-dark">{order.user?.name || 'Vô danh'}</div>
                      <div className="text-[12px] text-apple-gray">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="p-3 text-apple-dark font-medium">
                      {formatMoney(order.totalPrice)}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block py-0.5 px-2 rounded-xl text-[12px] font-semibold ${
                        order.isPaid ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-[#fff4d6] text-[#a15c00]'
                      }`}>
                        {order.isPaid ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-apple-blue hover:text-[#0077ed] bg-transparent border-none p-1 rounded-full hover:bg-[#f5f5f7] cursor-pointer transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected Order Details Panel */}
        <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 shadow-sm min-h-[300px]">
          {selectedOrder ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-[17px] font-bold text-apple-dark">Chi tiết đơn hàng</h3>
                <p className="text-[12px] text-apple-gray mt-0.5">#{selectedOrder._id}</p>
              </div>

              {/* Customer */}
              <div className="flex gap-3 items-start border-b border-[#f2f2f2] pb-4">
                <div className="w-9 h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center text-apple-blue">
                  <User size={18} />
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-apple-gray">Khách hàng</div>
                  <div className="text-[14px] font-bold text-apple-dark mt-0.5">{selectedOrder.user?.name || 'N/A'}</div>
                  <div className="text-[12px] text-apple-gray">{selectedOrder.user?.email || 'N/A'}</div>
                </div>
              </div>

              {/* Order Info */}
              <div className="flex gap-3 items-start border-b border-[#f2f2f2] pb-4">
                <div className="w-9 h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center text-apple-blue">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-apple-gray">Thời gian tạo</div>
                  <div className="text-[14px] font-medium text-apple-dark mt-0.5">
                    {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                  </div>
                  {selectedOrder.isPaid && selectedOrder.paidAt && (
                    <div className="text-[12px] text-[#1e8e3e] mt-0.5 font-semibold">
                      Thanh toán lúc: {new Date(selectedOrder.paidAt).toLocaleString('vi-VN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Products List */}
              <div>
                <div className="text-[13px] font-semibold text-apple-gray mb-2.5">Sản phẩm đã mua</div>
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#f9f9fb] p-2.5 rounded-xl border border-black/5">
                      <div className="max-w-[180px]">
                        <div className="text-[13px] font-semibold text-apple-dark truncate" title={item.title}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-apple-gray mt-0.5">SL: {item.quantity}</div>
                      </div>
                      <div className="text-[13px] font-bold text-apple-dark">
                        {formatMoney(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voucher */}
              {selectedOrder.voucherCode && (
                <div className="flex gap-3 items-start bg-[#fff4d6] p-3 rounded-xl border border-[#ffe082]/30 text-[13px] text-[#805000]">
                  <Tag size={16} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Voucher áp dụng: </span>
                    <span className="font-mono bg-white/60 px-1.5 py-0.5 rounded text-[12px] font-semibold">{selectedOrder.voucherCode}</span>
                    <div className="mt-0.5">Giảm giá: <span className="font-bold">-{formatMoney(selectedOrder.discountAmount || 0)}</span></div>
                  </div>
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="pt-3 border-t border-[#f2f2f2] space-y-1.5 text-[14px]">
                <div className="flex justify-between text-apple-gray">
                  <span>Tạm tính</span>
                  <span>{formatMoney(selectedOrder.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0))}</span>
                </div>
                {selectedOrder.discountAmount ? (
                  <div className="flex justify-between text-apple-gray">
                    <span>Giảm giá</span>
                    <span>-{formatMoney(selectedOrder.discountAmount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between font-bold text-apple-dark text-[15px] pt-1.5 border-t border-black/5">
                  <span>Tổng tiền</span>
                  <span className="text-apple-blue">{formatMoney(selectedOrder.totalPrice)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center text-apple-gray py-[60px]">
              <ShoppingBag size={40} className="mb-3 opacity-60" />
              <p className="text-[14px] leading-relaxed max-w-[200px]">Chọn một đơn hàng ở danh sách để xem chi tiết hóa đơn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManager;

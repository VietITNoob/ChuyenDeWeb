import React, { useEffect, useState } from 'react';
import { Loader2, Landmark, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { sellerService } from '../../../service/sellerService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';

interface WithdrawRequest {
  _id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

const formatMoney = (value: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(value || 0);

const WithdrawPanel: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await sellerService.getWithdrawRequests();
      setRequests(data);
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách yêu cầu rút tiền.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = Number(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      showToast('Số tiền rút không hợp lệ.', 'error');
      return;
    }

    if (user?.balance && user.balance < withdrawAmount) {
      showToast('Số dư khả dụng của bạn không đủ.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await sellerService.createWithdrawRequest({
        amount: withdrawAmount,
        bankName,
        accountNumber,
        accountName,
      });
      showToast(res.message || 'Gửi yêu cầu rút tiền thành công!');
      
      // Update local state
      setRequests((current) => [res.withdrawRequest, ...current]);
      setAmount('');
      
      // Refresh context user balance
      await refreshUser();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Lỗi khi gửi yêu cầu rút tiền.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      {/* Withdraw Request Form */}
      <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 shadow-sm xl:col-span-1">
        <h3 className="text-[17px] font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
          <Landmark size={20} className="text-apple-blue" />
          Yêu cầu rút tiền
        </h3>

        {/* Balance Display */}
        <div className="bg-gradient-to-br from-apple-blue to-[#0051a8] text-white p-5 rounded-2xl mb-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />
          <div className="text-[13px] font-medium text-white/80">Số dư khả dụng</div>
          <div className="text-2xl font-bold mt-1.5">{formatMoney(user?.balance || 0)}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5">Số tiền muốn rút (VND)</label>
            <input
              type="number"
              required
              min={50000}
              placeholder="Ví dụ: 200000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] bg-white text-[14px] outline-none transition-all focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20"
            />
            <p className="text-[11px] text-apple-gray mt-1">Hạn mức rút tối thiểu là 50,000 VND</p>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5">Tên ngân hàng</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Vietcombank, Techcombank..."
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] bg-white text-[14px] outline-none transition-all focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5">Số tài khoản</label>
            <input
              type="text"
              required
              placeholder="Nhập số tài khoản ngân hàng..."
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] bg-white text-[14px] outline-none transition-all focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20"
            />
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5">Tên chủ tài khoản (Viết hoa không dấu)</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: NGUYEN VAN A"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] bg-white text-[14px] outline-none transition-all focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20 uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !amount || Number(amount) <= 0 || (user?.balance !== undefined && user.balance < Number(amount))}
            className="w-full py-3 rounded-xl bg-apple-blue text-white text-[14px] font-bold shadow-sm hover:bg-[#0077ed] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Gửi yêu cầu rút
          </button>
        </form>
      </div>

      {/* Withdraw History List */}
      <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 shadow-sm xl:col-span-2">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-[17px] font-bold text-[#1d1d1f]">Lịch sử rút tiền</h3>
          <button 
            onClick={fetchRequests} 
            disabled={loading}
            className="p-2 rounded-full text-apple-gray hover:text-apple-dark hover:bg-[#f5f5f7] border-none cursor-pointer transition-colors active:scale-90"
            title="Tải lại lịch sử"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-apple-blue" size={28} />
          </div>
        ) : error ? (
          <div className="text-[#ff3b30] p-4 bg-[#ffecec] rounded-xl border border-[#ffccc9]">{error}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-[80px] text-apple-gray">
            <HelpCircle size={40} className="mx-auto opacity-50" />
            <p className="mt-3 text-[14px]">Bạn chưa tạo yêu cầu rút tiền nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#e5e5ea] bg-[#f9f9fb]">
                  <th className="p-3 font-semibold text-apple-gray">Ngày gửi</th>
                  <th className="p-3 font-semibold text-apple-gray">Số tiền</th>
                  <th className="p-3 font-semibold text-apple-gray">Ngân hàng thụ hưởng</th>
                  <th className="p-3 font-semibold text-apple-gray">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request._id} className="border-b border-[#f2f2f2] last:border-b-0 hover:bg-[#f9f9fb] transition-colors">
                    <td className="p-3 text-[13px] text-apple-dark">
                      {new Date(request.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-3 text-apple-dark font-bold">
                      {formatMoney(request.amount)}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-apple-dark">{request.bankName}</div>
                      <div className="text-[12px] text-apple-gray mt-0.5">{request.accountNumber} - {request.accountName}</div>
                    </td>
                    <td className="p-3 align-middle">
                      <span className={`inline-block py-0.5 px-2 rounded-xl text-[12px] font-semibold ${
                        request.status === 'approved' 
                          ? 'bg-[#e6f4ea] text-[#1e8e3e]' 
                          : request.status === 'rejected'
                          ? 'bg-[#ffecec] text-[#d70015]'
                          : 'bg-[#fff4d6] text-[#a15c00]'
                      }`}>
                        {request.status === 'approved' ? 'Thành công' : request.status === 'rejected' ? 'Bị từ chối' : 'Chờ xử lý'}
                      </span>
                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="text-[11px] text-[#d70015] mt-1 flex items-start gap-1">
                          <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                          <span>Lý do: {request.rejectionReason}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawPanel;

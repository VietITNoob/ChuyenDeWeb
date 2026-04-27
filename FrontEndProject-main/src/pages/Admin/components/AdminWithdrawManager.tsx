import React, { useEffect, useState } from 'react';
import { Loader2, Landmark, Check, X } from 'lucide-react';
import { adminService } from '../../../service/adminService';
import { useToast } from '../../../context/ToastContext';
import { ConfirmModal } from '../../../components/UI/ConfirmModal';
import { PromptModal } from '../../../components/UI/PromptModal';

interface WithdrawRequest {
  _id: string;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
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

const AdminWithdrawManager: React.FC = () => {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  // Modal States
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getWithdrawRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách yêu cầu rút tiền.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveClick = (id: string) => {
    setApproveTargetId(id);
    setIsApproveModalOpen(true);
  };

  const confirmApprove = async () => {
    if (!approveTargetId) return;
    const id = approveTargetId;
    setActionId(`approve-${id}`);
    try {
      await adminService.approveWithdrawRequest(id);
      setRequests((current) =>
        current.map((req) => (req._id === id ? { ...req, status: 'approved' } : req))
      );
      showToast('Đã duyệt yêu cầu rút tiền thành công!');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Không thể duyệt yêu cầu.', 'error');
    } finally {
      setActionId(null);
      setApproveTargetId(null);
    }
  };

  const handleRejectClick = (id: string) => {
    setRejectTargetId(id);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTargetId || !reason.trim()) return;
    const id = rejectTargetId;
    setActionId(`reject-${id}`);
    try {
      await adminService.rejectWithdrawRequest(id, reason.trim());
      setRequests((current) =>
        current.map((req) => (req._id === id ? { ...req, status: 'rejected', rejectionReason: reason.trim() } : req))
      );
      showToast('Đã từ chối yêu cầu và hoàn lại số dư cho người bán.');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Không thể từ chối yêu cầu.', 'error');
    } finally {
      setActionId(null);
      setRejectTargetId(null);
    }
  };

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
      <div className="bg-white border border-[#e5e5ea] rounded-2xl p-5 overflow-x-auto shadow-sm">
        {requests.length === 0 ? (
          <div className="text-center py-[60px] text-apple-gray">
            <Landmark size={48} className="mx-auto" />
            <h3 className="text-apple-dark mt-4 mb-2 text-[16px] font-semibold">Chưa có yêu cầu rút tiền nào</h3>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#e5e5ea] bg-[#f9f9fb]">
                <th className="p-4 font-semibold text-apple-gray">Thời gian</th>
                <th className="p-4 font-semibold text-apple-gray">Seller</th>
                <th className="p-4 font-semibold text-apple-gray">Số tiền rút</th>
                <th className="p-4 font-semibold text-apple-gray">Ngân hàng thụ hưởng</th>
                <th className="p-4 font-semibold text-apple-gray">Trạng thái</th>
                <th className="p-4 font-semibold text-apple-gray">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const processing = actionId === `approve-${request._id}` || actionId === `reject-${request._id}`;

                return (
                  <tr key={request._id} className="border-b border-[#f2f2f2] last:border-b-0 hover:bg-[#f9f9fb] transition-colors">
                    <td className="p-4 text-[13px] text-apple-dark">
                      {new Date(request.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-apple-dark">{request.seller?.name || 'Vô danh'}</div>
                      <div className="text-[12px] text-apple-gray">{request.seller?.email || 'N/A'}</div>
                    </td>
                    <td className="p-4 text-apple-dark font-bold text-[15px]">
                      {formatMoney(request.amount)}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-apple-dark">{request.bankName}</div>
                      <div className="text-[13px] font-mono text-apple-dark mt-0.5">{request.accountNumber}</div>
                      <div className="text-[12px] text-apple-gray mt-0.5 capitalize">{request.accountName}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block py-1 px-2.5 rounded-xl text-[13px] font-semibold ${
                        request.status === 'approved' 
                          ? 'bg-[#e6f4ea] text-[#1e8e3e]' 
                          : request.status === 'rejected'
                          ? 'bg-[#ffecec] text-[#d70015]'
                          : 'bg-[#fff4d6] text-[#a15c00]'
                      }`}>
                        {request.status === 'approved' ? 'Đã duyệt' : request.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                      </span>
                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="text-[11px] text-[#d70015] mt-1 italic max-w-[200px] leading-tight">
                          Lý do: {request.rejectionReason}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={processing}
                            onClick={() => handleApproveClick(request._id)}
                            className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-[#0071e3] text-white border-none cursor-pointer hover:bg-[#0077ed] active:scale-95 disabled:opacity-60 transition-all font-semibold"
                          >
                            {actionId === `approve-${request._id}` ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                            Duyệt
                          </button>
                          <button
                            type="button"
                            disabled={processing}
                            onClick={() => handleRejectClick(request._id)}
                            className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-[#fff0ef] text-[#d70015] border-none cursor-pointer hover:bg-[#ffcdd2] active:scale-95 disabled:opacity-60 transition-all font-semibold"
                          >
                            {actionId === `reject-${request._id}` ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <X size={14} />
                            )}
                            Từ chối
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ConfirmModal for Approving Withdrawal */}
      <ConfirmModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setApproveTargetId(null);
        }}
        onConfirm={confirmApprove}
        title="Duyệt yêu cầu rút tiền"
        message="Xác nhận rằng bạn đã chuyển khoản số tiền này cho người nhận và muốn đánh dấu yêu cầu là Hoàn thành?"
        confirmText="Duyệt yêu cầu"
      />

      {/* PromptModal for Rejection Reason */}
      <PromptModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setRejectTargetId(null);
        }}
        onSubmit={handleRejectConfirm}
        title="Từ chối yêu cầu rút tiền"
        label="Lý do từ chối (Tiền sẽ được hoàn lại số dư của Seller)"
        placeholder="Nhập lý do cụ thể (tối thiểu 5 ký tự)..."
        submitText="Từ chối yêu cầu"
      />
    </div>
  );
};

export default AdminWithdrawManager;

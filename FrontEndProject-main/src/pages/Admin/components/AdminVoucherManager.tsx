import React, { useEffect, useState } from 'react';
import { Gift, Loader2 } from 'lucide-react';
import { voucherService } from '../../../service/voucherService';
import type { Voucher } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import { ConfirmModal } from '../../../components/UI/ConfirmModal';
import { PromptModal } from '../../../components/UI/PromptModal';

const money = (value: number) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
}).format(value || 0);

const getErrorMessage = (error: any, fallback: string) => {
    return error?.response?.data?.message || error?.message || fallback;
};

const AdminVoucherManager: React.FC = () => {
    const { showToast } = useToast();
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState('');

    // Modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);

    const loadVouchers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await voucherService.getAllVouchers();
            setVouchers(data);
        } catch (err: any) {
            setError(getErrorMessage(err, 'Không thể tải danh sách voucher.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVouchers();
    }, []);

    const patchVoucher = (id: string, patch: Partial<Voucher>) => {
        setVouchers((current) => current.map((voucher) => voucher._id === id ? { ...voucher, ...patch } : voucher));
    };

    const handleToggle = async (voucher: Voucher) => {
        const nextActive = !voucher.isActive;
        setActionId(`toggle-${voucher._id}`);
        try {
            await voucherService.toggleVoucher(voucher._id, nextActive);
            patchVoucher(voucher._id, { isActive: nextActive });
            showToast(nextActive ? 'Đã bật hoạt động voucher!' : 'Đã tạm tắt voucher!');
        } catch (err: any) {
            showToast(getErrorMessage(err, 'Không thể cập nhật voucher.'), 'error');
        } finally {
            setActionId(null);
        }
    };

    const handleApprove = async (id: string) => {
        setActionId(`approve-${id}`);
        try {
            await voucherService.approveVoucher(id);
            patchVoucher(id, { status: 'approved', rejectionReason: '', isActive: true });
            showToast('Đã duyệt voucher thành công!');
        } catch (err: any) {
            showToast(getErrorMessage(err, 'Không thể duyệt voucher.'), 'error');
        } finally {
            setActionId(null);
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
            await voucherService.rejectVoucher(id, reason.trim());
            patchVoucher(id, { status: 'rejected', rejectionReason: reason.trim(), isActive: false });
            showToast('Đã từ chối duyệt voucher.');
        } catch (err: any) {
            showToast(getErrorMessage(err, 'Không thể từ chối voucher.'), 'error');
        } finally {
            setActionId(null);
            setRejectTargetId(null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteTargetId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        const id = deleteTargetId;
        setActionId(`delete-${id}`);
        try {
            await voucherService.deleteVoucher(id);
            setVouchers((current) => current.filter((voucher) => voucher._id !== id));
            showToast('Đã xóa voucher thành công!');
        } catch (err: any) {
            showToast(getErrorMessage(err, 'Không thể xóa voucher.'), 'error');
        } finally {
            setActionId(null);
            setDeleteTargetId(null);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-[60px]"><Loader2 className="animate-spin text-apple-blue" size={32} /></div>;
    }

    if (error) {
        return <div className="text-[#ff3b30] p-5">{error}</div>;
    }

    return (
        <div className="relative">
            <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-6 overflow-x-auto">
                {vouchers.length === 0 ? (
                    <div className="text-center py-[60px] px-5 text-apple-gray">
                        <Gift size={48} className="mx-auto" />
                        <h3 className="text-apple-dark mt-4 mb-2 text-lg font-semibold">Chưa có voucher</h3>
                    </div>
                ) : (
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Mã</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Seller</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Giá trị</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Sản phẩm áp dụng</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Duyệt</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Trạng thái</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher) => {
                                const approving = actionId === `approve-${voucher._id}`;
                                const rejecting = actionId === `reject-${voucher._id}`;
                                const toggling = actionId === `toggle-${voucher._id}`;
                                const deleting = actionId === `delete-${voucher._id}`;

                                return (
                                    <tr key={voucher._id} className="border-b border-[#e5e5ea] last:border-b-0 hover:bg-[#f9f9fb] transition-colors">
                                        <td className="p-4 font-semibold text-apple-dark">{voucher.code}</td>
                                        <td className="p-4 text-apple-dark">{typeof voucher.seller === 'object' ? voucher.seller.name : voucher.seller}</td>
                                        <td className="p-4 text-apple-dark">{voucher.discountType === 'percent' ? `${voucher.discountValue}%` : money(voucher.discountValue)}</td>
                                        <td className="p-4 text-apple-dark max-w-[320px]">{voucher.applicableProducts?.map((product) => product.title).join(', ')}</td>
                                        <td className="p-4">
                                            <span className={`inline-block py-1 px-2.5 rounded-xl text-[13px] font-semibold ${voucher.status === 'approved' ? 'bg-[#e6f4ea] text-[#1e8e3e]' : voucher.status === 'rejected' ? 'bg-[#ffecec] text-[#d70015]' : 'bg-[#fff4d6] text-[#a15c00]'}`}>
                                                {voucher.status === 'approved' ? 'Đã duyệt' : voucher.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-block py-1 px-2.5 rounded-xl text-[13px] font-semibold ${voucher.isActive ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
                                                {voucher.isActive ? 'Đang bật' : 'Đang tắt'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-apple-dark align-middle">
                                            <div className="flex gap-2">
                                                {voucher.status !== 'approved' && (
                                                    <button type="button" disabled={!!actionId} onClick={() => handleApprove(voucher._id)} className="inline-flex items-center gap-1 py-2 px-3 rounded-lg bg-[#0071e3] text-white border-none cursor-pointer disabled:opacity-60 hover:bg-[#0077ed] active:scale-95 transition-all">
                                                        {approving && <Loader2 size={14} className="animate-spin" />}
                                                        Duyệt
                                                    </button>
                                                )}
                                                {voucher.status !== 'rejected' && (
                                                    <button type="button" disabled={!!actionId} onClick={() => handleRejectClick(voucher._id)} className="inline-flex items-center gap-1 py-2 px-3 rounded-lg bg-[#fff4d6] text-[#a15c00] border-none cursor-pointer disabled:opacity-60 hover:bg-[#ffe082] active:scale-95 transition-all">
                                                        {rejecting && <Loader2 size={14} className="animate-spin" />}
                                                        Từ chối
                                                    </button>
                                                )}
                                                <button type="button" disabled={!!actionId} onClick={() => handleToggle(voucher)} className="inline-flex items-center gap-1 py-2 px-3 rounded-lg bg-[#f5f5f7] text-apple-dark border-none cursor-pointer disabled:opacity-60 hover:bg-[#e5e5ea] active:scale-95 transition-all">
                                                    {toggling && <Loader2 size={14} className="animate-spin" />}
                                                    {voucher.isActive ? 'Tắt' : 'Bật'}
                                                </button>
                                                <button type="button" disabled={!!actionId} onClick={() => handleDeleteClick(voucher._id)} className="inline-flex items-center gap-1 py-2 px-3 rounded-lg bg-[#fff0ef] text-[#ff3b30] border-none cursor-pointer disabled:opacity-60 hover:bg-[#ffcdd2] active:scale-95 transition-all">
                                                    {deleting && <Loader2 size={14} className="animate-spin" />}
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Reusable ConfirmModal for deletion */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTargetId(null);
                }}
                onConfirm={confirmDelete}
                title="Xóa voucher"
                message="Bạn có chắc chắn muốn xóa mã giảm giá này không? Hành động này sẽ vô hiệu hóa việc áp dụng mã giảm giá này."
                confirmText="Xóa voucher"
                isDanger={true}
            />

            {/* Reusable PromptModal for rejection reason */}
            <PromptModal
                isOpen={isRejectModalOpen}
                onClose={() => {
                    setIsRejectModalOpen(false);
                    setRejectTargetId(null);
                }}
                onSubmit={handleRejectConfirm}
                title="Từ chối voucher"
                label="Lý do từ chối"
                placeholder="Nhập lý do từ chối (ít nhất 5 ký tự)..."
                submitText="Từ chối voucher"
            />
        </div>
    );
};

export default AdminVoucherManager;

import React, { useEffect, useState } from 'react';
import { Gift, Loader2 } from 'lucide-react';
import { voucherService } from '../../../service/voucherService';
import type { Voucher } from '../../../types';

const money = (value: number) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
}).format(value || 0);

const AdminVoucherManager: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadVouchers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await voucherService.getAllVouchers();
            setVouchers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Khong the tai danh sach voucher.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVouchers();
    }, []);

    const handleToggle = async (voucher: Voucher) => {
        await voucherService.toggleVoucher(voucher._id, !voucher.isActive);
        loadVouchers();
    };

    const handleApprove = async (id: string) => {
        await voucherService.approveVoucher(id);
        loadVouchers();
    };

    const handleReject = async (id: string) => {
        const reason = window.prompt('Nhập lý do từ chối voucher');
        if (!reason || reason.trim().length < 5) return;
        await voucherService.rejectVoucher(id, reason.trim());
        loadVouchers();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Xoa voucher nay?')) return;
        await voucherService.deleteVoucher(id);
        loadVouchers();
    };

    if (loading) {
        return <div className="flex justify-center p-[60px]"><Loader2 className="animate-spin text-apple-blue" size={32} /></div>;
    }

    if (error) {
        return <div className="text-[#ff3b30] p-5">{error}</div>;
    }

    return (
        <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-6 overflow-x-auto">
            {vouchers.length === 0 ? (
                <div className="text-center py-[60px] px-5 text-apple-gray">
                    <Gift size={48} className="mx-auto" />
                    <h3 className="text-apple-dark mt-4 mb-2 text-lg font-semibold">Chua co voucher</h3>
                </div>
            ) : (
                <table className="w-full border-collapse text-left">
                    <thead>
                        <tr>
                            <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Ma</th>
                            <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Seller</th>
                            <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Gia tri</th>
                            <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">San pham ap dung</th>
                            <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Duyệt</th>
                            <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Trang thai</th>
                            <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Hanh dong</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((voucher) => (
                            <tr key={voucher._id} className="border-b border-[#e5e5ea] last:border-b-0">
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
                                        {voucher.isActive ? 'Dang bat' : 'Dang tat'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        {voucher.status !== 'approved' && <button onClick={() => handleApprove(voucher._id)} className="py-2 px-3 rounded-full bg-[#0071e3] text-white border-none cursor-pointer">Duyệt</button>}
                                        {voucher.status !== 'rejected' && <button onClick={() => handleReject(voucher._id)} className="py-2 px-3 rounded-full bg-[#fff4d6] text-[#a15c00] border-none cursor-pointer">Từ chối</button>}
                                        <button onClick={() => handleToggle(voucher)} className="py-2 px-3 rounded-full bg-[#f5f5f7] text-apple-dark border-none cursor-pointer">{voucher.isActive ? 'Tat' : 'Bat'}</button>
                                        <button onClick={() => handleDelete(voucher._id)} className="py-2 px-3 rounded-full bg-[#fff0ef] text-[#ff3b30] border-none cursor-pointer">Xoa</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminVoucherManager;

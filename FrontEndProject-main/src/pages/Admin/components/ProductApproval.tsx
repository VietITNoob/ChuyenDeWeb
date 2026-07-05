import React, { useEffect, useState } from 'react';
import { productService } from '../../../service/productService';
import type { Product } from '../../../types';
import { Loader2, PackageOpen, CheckCircle, XCircle, X } from 'lucide-react';

// Modal từ chối sản phẩm
interface RejectModalProps {
    productTitle: string;
    onConfirm: (reason: string) => void;
    onCancel: () => void;
    isLoading: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({ productTitle, onConfirm, onCancel, isLoading }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (reason.trim().length < 10) {
            setError('Lý do từ chối phải có ít nhất 10 ký tự.');
            return;
        }
        onConfirm(reason.trim());
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] w-full max-w-[480px] animate-[fadeInUp_0.2s_ease]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#e5e5ea]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                            <XCircle size={20} className="text-[#ff3b30]" />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-semibold text-apple-dark">Từ chối sản phẩm</h3>
                            <p className="text-[13px] text-apple-gray truncate max-w-[280px]">{productTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center border-none cursor-pointer hover:bg-[#e8e8ed] transition-colors"
                    >
                        <X size={16} className="text-apple-dark" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <label className="block text-[14px] font-medium text-apple-dark mb-2">
                        Lý do từ chối <span className="text-[#ff3b30]">*</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => { setReason(e.target.value); setError(''); }}
                        placeholder="Nhập lý do cụ thể để Seller biết cách chỉnh sửa..."
                        rows={4}
                        className="w-full p-3 rounded-xl border border-[#d2d2d7] text-[15px] resize-none font-sans bg-white text-apple-dark outline-none focus:border-[#ff3b30] transition-colors"
                        autoFocus
                    />
                    {error && <p className="text-[#ff3b30] text-[13px] mt-1">{error}</p>}
                    <p className="text-[12px] text-apple-gray mt-1">{reason.length}/500 ký tự (tối thiểu 10)</p>

                    {/* Actions */}
                    <div className="flex gap-3 mt-5">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 rounded-full text-[15px] font-semibold bg-[#f5f5f7] text-apple-dark border-none cursor-pointer hover:bg-[#e8e8ed] transition-colors disabled:opacity-50"
                        >
                            Huỷ bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 rounded-full text-[15px] font-semibold bg-[#ff3b30] text-white border-none cursor-pointer hover:bg-[#d63028] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <><Loader2 size={16} className="animate-spin" /> Đang từ chối...</> : <>Xác nhận từ chối</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Component chính
const ProductApproval: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [rejectModalProduct, setRejectModalProduct] = useState<Product | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchProducts = async () => {
        try {
            const data = await productService.getUnapproved();
            setProducts(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tải danh sách sản phẩm chờ duyệt.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleApprove = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn duyệt sản phẩm này để đăng bán?')) return;

        setApprovingId(id);
        try {
            await productService.approveProduct(id);
            setProducts(products.filter(p => p._id !== id));
            showToast('✅ Đã duyệt sản phẩm thành công!', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Lỗi khi duyệt sản phẩm', 'error');
        } finally {
            setApprovingId(null);
        }
    };

    const handleRejectConfirm = async (reason: string) => {
        if (!rejectModalProduct) return;
        const id = rejectModalProduct._id as string;

        setRejectingId(id);
        try {
            await productService.rejectProduct(id, reason);
            setProducts(products.filter(p => p._id !== id));
            setRejectModalProduct(null);
            showToast('🚫 Đã từ chối sản phẩm và thông báo cho Seller.', 'success');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Lỗi khi từ chối sản phẩm', 'error');
        } finally {
            setRejectingId(null);
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
        return <div className="text-[#ff3b30] p-5">{error}</div>;
    }

    return (
        <>
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[300] px-5 py-4 rounded-[16px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-[15px] font-medium transition-all duration-300 ${toast.type === 'success' ? 'bg-white text-apple-dark border-l-4 border-[#30d158]' : 'bg-white text-[#ff3b30] border-l-4 border-[#ff3b30]'}`}>
                    {toast.message}
                </div>
            )}

            {/* Modal từ chối */}
            {rejectModalProduct && (
                <RejectModal
                    productTitle={rejectModalProduct.title}
                    onConfirm={handleRejectConfirm}
                    onCancel={() => setRejectModalProduct(null)}
                    isLoading={rejectingId === rejectModalProduct._id}
                />
            )}

            <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-6 overflow-x-auto">
                {products.length === 0 ? (
                    <div className="text-center py-[60px] px-5 text-apple-gray">
                        <PackageOpen size={48} className="mx-auto" />
                        <h3 className="text-apple-dark mt-4 mb-2 text-lg font-semibold">Tuyệt vời!</h3>
                        <p>Hiện không có sản phẩm nào đang chờ duyệt.</p>
                    </div>
                ) : (
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Hình ảnh</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Tên sản phẩm</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Giá</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Nền tảng / Ngôn ngữ</th>
                                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id} className="last:border-b-0 border-b border-[#e5e5ea]">
                                    <td className="p-4 text-[15px] text-apple-dark align-middle">
                                        <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                                    </td>
                                    <td className="p-4 text-[15px] text-apple-dark align-middle font-medium max-w-[200px]">
                                        <div className="truncate">{product.title}</div>
                                        <div className="text-[12px] text-apple-gray mt-0.5">
                                            Seller: {typeof product.seller === 'object' ? product.seller.name : product.seller}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[15px] text-apple-dark align-middle whitespace-nowrap">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
                                    </td>
                                    <td className="p-4 text-[15px] text-apple-dark align-middle">
                                        <div className="text-[13px]">{product.platform}</div>
                                        <div className="text-[12px] text-apple-gray">{product.language}</div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex gap-2">
                                            {/* Nút Duyệt */}
                                            <button
                                                className="py-2 px-4 bg-apple-blue text-white border-none rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 hover:bg-[#0077ed] hover:scale-105 disabled:bg-[#d2d2d7] disabled:cursor-not-allowed disabled:scale-100"
                                                onClick={() => handleApprove(product._id as string)}
                                                disabled={approvingId === product._id || rejectingId === product._id}
                                            >
                                                {approvingId === product._id ? (
                                                    <><Loader2 size={14} className="animate-spin" /> Duyệt...</>
                                                ) : (
                                                    <><CheckCircle size={14} /> Duyệt</>
                                                )}
                                            </button>

                                            {/* Nút Từ chối */}
                                            <button
                                                className="py-2 px-4 bg-[#fff0ef] text-[#ff3b30] border border-[#ffccc9] rounded-full text-[13px] font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 hover:bg-[#ff3b30] hover:text-white hover:border-[#ff3b30] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                                                onClick={() => setRejectModalProduct(product)}
                                                disabled={approvingId === product._id || rejectingId === product._id}
                                            >
                                                {rejectingId === product._id ? (
                                                    <><Loader2 size={14} className="animate-spin" /> Từ chối...</>
                                                ) : (
                                                    <><XCircle size={14} /> Từ chối</>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default ProductApproval;

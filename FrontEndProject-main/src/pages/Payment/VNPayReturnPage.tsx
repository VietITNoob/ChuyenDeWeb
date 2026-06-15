import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const VNPayReturnPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [message, setMessage] = useState('Đang xác nhận thanh toán...');
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());
                const queryString = new URLSearchParams(params).toString();

                const result = await axiosClient.get(`/payment/vnpay_return?${queryString}`) as any;
                const txnRef = searchParams.get('vnp_TxnRef') || '';
                setOrderId(txnRef);

                if (result.code === '00') {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Cảm ơn bạn đã mua hàng tại CodeStore.');
                    setTimeout(() => navigate('/account/home'), 3000);
                } else {
                    setStatus('failed');
                    setMessage(`Thanh toán thất bại. Mã lỗi: ${result.code || 'Không xác định'}`);
                }
            } catch (error: any) {
                console.error('VNPay verify error:', error);
                setStatus('failed');
                setMessage('Không thể xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.');
            }
        };

        verifyPayment();
    }, [navigate, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f7] to-[#e8f0fe] font-sans">
            <div className="bg-white rounded-3xl py-[60px] px-12 text-center max-w-[480px] w-[90%] shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
                {status === 'loading' && (
                    <>
                        <Loader2 size={64} className="animate-spin text-apple-blue mx-auto mb-6" />
                        <h2 className="text-[24px] font-bold text-apple-dark mb-3">
                            Đang xác nhận...
                        </h2>
                        <p className="text-[#86868b] text-[16px]">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <CheckCircle size={80} className="text-[#34c759] mx-auto mb-6 block" />
                        <h2 className="text-[28px] font-bold text-apple-dark mb-3">
                            Thanh toán thành công! 🎉
                        </h2>
                        <p className="text-[#86868b] text-[16px] leading-[1.6] mb-2">
                            {message}
                        </p>
                        {orderId && (
                            <p className="text-[#86868b] text-[14px] mb-8">
                                Mã giao dịch: <strong className="text-apple-dark">{orderId.slice(-8).toUpperCase()}</strong>
                            </p>
                        )}
                        <p className="text-apple-blue text-[14px]">
                            Đang chuyển về trang quản lý đơn hàng...
                        </p>
                        <button
                            onClick={() => navigate('/account/home')}
                            className="mt-6 py-3.5 px-8 rounded-full bg-apple-blue text-white border-none text-[17px] font-semibold cursor-pointer hover:bg-[#0077ed]"
                        >
                            Xem đơn hàng ngay
                        </button>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <XCircle size={80} className="text-[#ff3b30] mx-auto mb-6 block" />
                        <h2 className="text-[28px] font-bold text-apple-dark mb-3">
                            Thanh toán thất bại
                        </h2>
                        <p className="text-[#86868b] text-[16px] leading-[1.6] mb-8">
                            {message}
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <button
                                onClick={() => navigate('/cart')}
                                className="py-3.5 px-6 rounded-full bg-apple-blue text-white border-none text-[15px] font-semibold cursor-pointer hover:bg-[#0077ed]"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="py-3.5 px-6 rounded-full bg-transparent text-apple-blue border-2 border-apple-blue text-[15px] font-semibold cursor-pointer hover:bg-apple-blue hover:text-white"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VNPayReturnPage;

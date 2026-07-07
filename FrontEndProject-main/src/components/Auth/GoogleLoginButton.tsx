import React, { useState } from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface GoogleLoginButtonProps {
    /** Redirect sau khi login thành công. Mặc định: "/" */
    redirectTo?: string;
    /** Callback sau khi login thành công */
    onSuccess?: () => void;
    /** Callback khi có lỗi */
    onError?: (message: string) => void;
}

/**
 * Nút đăng nhập bằng Google sử dụng GoogleLogin component từ @react-oauth/google.
 * Dùng credential (ID Token) flow — tương thích với verifyIdToken ở backend.
 *
 * Để custom style hoàn toàn, component này dùng một wrapper ẩn GoogleLogin
 * và trigger bằng nút custom bên ngoài.
 */
const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
    redirectTo = '/',
    onSuccess,
    onError,
}) => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleCredentialResponse = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            onError?.('Không nhận được credential từ Google.');
            return;
        }

        setLoading(true);
        try {
            await loginWithGoogle(credentialResponse.credential);
            onSuccess?.();
            navigate(redirectTo);
        } catch (err: any) {
            const msg = err.message || 'Đăng nhập Google thất bại.';
            onError?.(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {loading ? (
                /* Loading state */
                <div className="w-full h-[52px] flex items-center justify-center gap-3 bg-white border border-[#d2d2d7] rounded-2xl text-[16px] font-medium text-[#86868b] cursor-not-allowed">
                    <div className="w-5 h-5 border-2 border-[#d2d2d7] border-t-apple-blue rounded-full animate-spin" />
                    <span>Đang xử lý...</span>
                </div>
            ) : (
                /* GoogleLogin render prop với style tuỳ chỉnh */
                <div className="relative w-full">
                    {/* Custom styled wrapper để Google button khớp với design */}
                    <div
                        className="w-full h-[52px] flex items-center justify-center gap-3 bg-white border border-[#d2d2d7] rounded-2xl text-[16px] font-medium text-[#1d1d1f] transition-all duration-200 hover:border-[#86868b] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 relative overflow-hidden cursor-pointer group"
                        style={{ userSelect: 'none' }}
                    >
                        {/* Google Logo */}
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M43.611 20.083H42V20H24V28H35.303C33.654 32.657 29.223 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24C4 35.045 12.955 44 24 44C35.045 44 44 35.045 44 24C44 22.659 43.862 21.35 43.611 20.083Z" fill="#FFC107"/>
                            <path d="M6.306 14.691L12.877 19.51C14.655 15.108 18.961 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691Z" fill="#FF3D00"/>
                            <path d="M24 44C29.166 44 33.86 42.023 37.409 38.808L31.219 33.57C29.211 35.091 26.715 36 24 36C18.798 36 14.381 32.683 12.717 28.054L6.195 33.079C9.505 39.556 16.227 44 24 44Z" fill="#4CAF50"/>
                            <path d="M43.611 20.083H42V20H24V28H35.303C34.511 30.237 33.072 32.166 31.216 33.572L31.219 33.57L37.409 38.808C36.971 39.205 44 34 44 24C44 22.659 43.862 21.35 43.611 20.083Z" fill="#1976D2"/>
                        </svg>
                        <span>Tiếp tục với Google</span>

                        {/* GoogleLogin button ẩn, phủ lên wrapper để bắt click */}
                        <div
                            className="absolute inset-0 opacity-0 flex items-center justify-center"
                            style={{ pointerEvents: 'all' }}
                        >
                            <GoogleLogin
                                onSuccess={handleCredentialResponse}
                                onError={() => onError?.('Không thể mở cửa sổ đăng nhập Google.')}
                                useOneTap={false}
                                auto_select={false}
                                type="standard"
                                size="large"
                                width="440"
                                theme="outline"
                                text="continue_with"
                                locale="vi"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoogleLoginButton;

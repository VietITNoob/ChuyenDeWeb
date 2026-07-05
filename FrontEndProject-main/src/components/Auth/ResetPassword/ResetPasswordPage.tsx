import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import AuthLayout from '../AuthLayout';
import { authService } from '../../../service/authService';

const ResetPasswordPage = () => {
  // Lấy token từ URL: /reset-password/:token
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const isMatch = password.length > 0 && password === confirmPassword;
  const isValidLength = password.length >= 6;
  const hasNumber = /\d/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch || !isValidLength || !hasNumber || !token) return;

    setLoading(true);
    setError('');

    try {
      // Gọi API backend → PUT /api/auth/reset-password/:token
      await authService.resetPassword(token, password);
      setIsSuccess(true);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Lỗi đổi mật khẩu. Token có thể đã hết hạn.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Token không có trong URL
  if (!token) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <div className="text-center mt-[100px] text-[#ff3b30] flex-1">
          Link không hợp lệ. Vui lòng yêu cầu lại <a href="/forgot" className="underline text-apple-blue">tại đây</a>.
        </div>
      </div>
    );
  }

  return (
    <AuthLayout>
      <Header />
      <div className="w-full max-w-[680px] mx-auto text-center py-[60px] px-5 flex flex-col justify-center">

        {!isSuccess ? (
          <>
            <div className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_0.1s_forwards]">
              <h1 className="text-[48px] leading-[1.05] font-bold text-apple-dark mb-4 tracking-[-0.015em] bg-clip-text">Mật khẩu mới.</h1>
              <h2 className="text-[21px] font-normal text-apple-gray mb-[50px]">
                Tạo mật khẩu mới cho tài khoản của bạn.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_0.2s_forwards]">
              <div className="max-w-[440px] mx-auto mb-10 relative text-left">

                {/* Input Mật khẩu mới */}
                <div className={`relative h-[64px] border rounded-2xl transition-all duration-400 flex items-center bg-white/80 backdrop-blur-[10px] ${isFocused === 'pass' ? 'border-apple-blue shadow-[0_0_0_4px_rgba(0,113,227,0.12),0_10px_25px_rgba(0,0,0,0.05)] scale-[1.01] bg-white' : 'border-[#d2d2d7]'}`}>
                  <label className={`absolute left-[18px] text-[18px] pointer-events-none transition-all duration-300 origin-top-left ${isFocused === 'pass' || password.length > 0 ? '-translate-y-3 scale-75 text-apple-gray font-medium top-[22px]' : 'text-apple-gray top-[22px]'}`}>Mật khẩu mới</label>
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full h-full border-none bg-transparent pt-6 px-4 pb-2 text-[18px] text-apple-dark rounded-2xl outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused('pass')}
                    onBlur={() => setIsFocused(null)}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 bg-transparent border-none text-apple-gray cursor-pointer transition-colors hover:text-apple-dark">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Input Nhập lại mật khẩu */}
                <div className={`overflow-hidden transition-all duration-500 origin-top ${password.length > 0 ? 'max-h-[100px] opacity-100 translate-y-0 mt-4' : 'max-h-0 opacity-0 -translate-y-2.5'}`}>
                  <div className={`relative h-[64px] border rounded-2xl transition-all duration-400 flex items-center bg-white/80 backdrop-blur-[10px] ${isFocused === 'confirm' ? 'border-apple-blue shadow-[0_0_0_4px_rgba(0,113,227,0.12),0_10px_25px_rgba(0,0,0,0.05)] scale-[1.01] bg-white' : isMatch ? 'border-apple-blue bg-[#e8f0fe]' : 'border-[#d2d2d7]'}`}>
                    <label className={`absolute left-[18px] text-[18px] pointer-events-none transition-all duration-300 origin-top-left ${isFocused === 'confirm' || confirmPassword.length > 0 ? '-translate-y-3 scale-75 text-apple-gray font-medium top-[22px]' : 'text-apple-gray top-[22px]'}`}>Nhập lại mật khẩu</label>
                    <input
                      type="password"
                      className="w-full h-full border-none bg-transparent pt-6 px-4 pb-2 text-[18px] text-apple-dark rounded-2xl outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setIsFocused('confirm')}
                      onBlur={() => setIsFocused(null)}
                    />

                    <button
                      type="submit"
                      className={`w-10 h-10 rounded-full border-none flex items-center justify-center cursor-pointer mr-3.5 transition-all duration-400 overflow-hidden ${isMatch && isValidLength && hasNumber ? 'bg-apple-blue text-white hover:bg-[#0077ed] hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)]' : 'bg-[#e5e5e5] text-[#888]'}`}
                      disabled={!isMatch || !isValidLength || !hasNumber || loading}
                    >
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ArrowRight size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Yêu cầu mật khẩu */}
              <div className="max-w-[440px] mx-auto text-left mt-[15px] text-[13px] text-apple-gray pl-2.5">
                <p className={`my-1 ${isValidLength ? 'text-[#34c759]' : ''}`}>• Tối thiểu 6 ký tự</p>
                <p className={`my-1 ${hasNumber ? 'text-[#34c759]' : ''}`}>• Chứa ít nhất 1 chữ số</p>
                <p className={`my-1 ${isMatch && password.length > 0 ? 'text-[#34c759]' : ''}`}>• Mật khẩu khớp nhau</p>
              </div>

              {error && <p className="text-[#ff3b30] text-center mt-2.5 text-[14px]">{error}</p>}
            </form>
          </>
        ) : (
          <div className="text-center py-10 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_forwards]">
            <div className="relative w-[100px] h-[100px] bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-[30px]">
              <Lock size={48} className="text-apple-dark animate-[float_3s_ease-in-out_infinite]" />
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)] animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                <CheckCircle2 size={20} fill="#34c759" color="white" />
              </div>
            </div>
            <h1 className="text-[32px] leading-[1.05] font-bold text-apple-dark mb-4">Thành công!</h1>
            <p className="text-[21px] font-normal text-apple-gray max-w-[400px] mx-auto my-2.5">Mật khẩu của bạn đã được cập nhật.</p>
            <div className="mt-[30px]">
              <button onClick={() => navigate('/login')} className="bg-[#1d1d1f] text-white py-3 px-10 rounded-full font-medium border-none cursor-pointer transition-opacity hover:opacity-80">
                Đăng nhập ngay
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
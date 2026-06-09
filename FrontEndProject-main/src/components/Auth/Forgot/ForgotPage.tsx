import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import { useForgotPassword } from './useForgotPassword';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import AuthLayout from '../AuthLayout';

const ForgotPasswordPage = () => {
  const {
    email,
    setEmail,
    loading,
    isSubmitted,
    error,
    isValidEmail,
    handleResetPassword,
    handleRetry
  } = useForgotPassword();

  const [isFocused, setIsFocused] = useState(false);

  return (
    <AuthLayout>
      <Header />

      <div className="w-full max-w-[680px] mx-auto text-center py-[60px] px-5 flex flex-col justify-center">
        
        {!isSubmitted ? (
          <>
            <div className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_0.1s_forwards]">
              <h1 className="text-[48px] leading-[1.05] font-bold text-apple-dark mb-4 tracking-[-0.015em] bg-clip-text">Khôi phục tài khoản.</h1>
              <h2 className="text-[21px] font-normal text-apple-gray mb-[50px]">
                Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
              </h2>
            </div>

            <form onSubmit={handleResetPassword} className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_0.2s_forwards]">
              <div className="max-w-[440px] mx-auto mb-10 relative">
                <div className={`relative h-[64px] border rounded-2xl transition-all duration-400 flex items-center bg-white/80 backdrop-blur-[10px] ${isFocused ? 'border-apple-blue shadow-[0_0_0_4px_rgba(0,113,227,0.12),0_10px_25px_rgba(0,0,0,0.05)] scale-[1.01] bg-white' : 'border-[#d2d2d7]'} ${error ? 'animate-[shake_0.4s_cubic-bezier(0.36,0.07,0.19,0.97)_both] border-[#ff3b30]' : ''}`}>
                  <label className={`absolute left-[18px] text-[18px] pointer-events-none transition-all duration-300 origin-top-left ${isFocused || email.length > 0 ? '-translate-y-3 scale-75 text-apple-gray font-medium top-[22px]' : 'text-apple-gray top-[22px]'}`}>Email đăng ký</label>
                  <input 
                    type="email" 
                    className="w-full h-full border-none bg-transparent pt-6 px-4 pb-2 text-[18px] text-apple-dark rounded-2xl outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    disabled={loading}
                  />
                  
                  <button 
                    type="submit" 
                    className={`w-10 h-10 rounded-full border-none flex items-center justify-center cursor-pointer mr-3.5 transition-all duration-400 overflow-hidden ${isValidEmail ? 'bg-apple-blue text-white hover:bg-[#0077ed] hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)]' : 'bg-[#e5e5e5] text-[#888]'}`}
                    disabled={!isValidEmail || loading}
                  >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <ArrowRight size={20} strokeWidth={2.5} className={`transition-transform duration-300 ${isValidEmail ? 'group-hover:translate-x-[3px]' : ''}`} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-[#ff3b30] mt-[15px] flex items-center justify-center gap-1.5 text-[14px] opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_forwards]">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="flex justify-center mt-[30px] opacity-0 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_0.4s_forwards]">
                <Link to="/login" className="text-apple-blue no-underline text-[15px] font-medium inline-flex items-center gap-1 transition-all hover:gap-2 hover:underline">
                  <ChevronLeft size={16} /> Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-10 opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_forwards]">
            <div className="relative w-[100px] h-[100px] bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-[30px]">
               <Mail size={48} className="text-apple-dark animate-[float_3s_ease-in-out_infinite]" />
               <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.1)] animate-[scaleIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
                 <CheckCircle2 size={20} fill="#34c759" color="white"/>
               </div>
            </div>
            
            <h1 className="text-[32px] leading-[1.05] font-bold text-apple-dark mb-4">Đã gửi email!</h1>
            <p className="text-[21px] font-normal text-apple-gray max-w-[400px] mx-auto my-2.5">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <b>{email}</b>.
              <br/>Vui lòng kiểm tra hộp thư (bao gồm cả mục Spam).
            </p>

            <div className="mt-10">
               <Link to="/login" className="inline-block py-3 px-[30px] border border-[#d2d2d7] rounded-full text-apple-dark font-medium no-underline transition-all hover:border-apple-gray hover:bg-[#f5f5f7]">
                 Quay lại đăng nhập
               </Link>
            </div>
            
            <div className="mt-5">
               <button 
                 onClick={handleRetry} 
                 className="bg-transparent border-none cursor-pointer text-[15px] text-apple-blue font-medium hover:underline"
               >
                 Gửi lại bằng email khác
               </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
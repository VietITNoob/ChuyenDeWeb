import { ArrowRight, Edit2 } from 'lucide-react';
import { useLogin } from './useLogin';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer';
import AuthLayout from '../AuthLayout';

const LoginPage = () => {
  const {
    step,
    email, setEmail,
    password, setPassword,
    isFocused, setIsFocused,
    loading,
    errorShake,
    isEmailValid,
    isPasswordValid,
    inputRef,
    passwordRef,
    handleSubmit,
    handleEditEmail
  } = useLogin();

  const ArrowButton = ({ isValid }: { isValid: boolean }) => (
    <button 
      type="submit" 
      className={`w-10 h-10 rounded-full border-none flex items-center justify-center cursor-pointer mr-3.5 transition-all duration-400 overflow-hidden ${isValid ? 'bg-apple-blue text-white hover:bg-[#0077ed] hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)]' : 'bg-[#e5e5e5] text-[#888]'}`}
      disabled={!isValid || loading}
      onClick={handleSubmit}
    >
      {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : (
          <ArrowRight size={20} strokeWidth={2.5} className={`transition-transform duration-300 ${isValid ? 'group-hover:translate-x-[3px]' : ''}`} />
      )}
    </button>
  );

  return (
    <AuthLayout>
      <Header />

      <div className="w-full max-w-[680px] mx-auto text-center py-[60px] px-5 flex flex-col justify-center">
        <div className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_0.1s_forwards]">
          <h1 className="text-[48px] leading-[1.05] font-bold text-apple-dark mb-4 tracking-[-0.015em] bg-clip-text">
            {step === 'email' ? 'Đăng nhập CodeStore.' : 'Nhập mật khẩu.'}
          </h1>
          <h2 className="text-[21px] font-normal text-apple-gray mb-[50px]">Trải nghiệm mua sắm source code nhanh chóng.</h2>
        </div>

        <form onSubmit={handleSubmit} className="opacity-0 translate-y-5 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_0.2s_forwards]">
          
          <div className="max-w-[440px] mx-auto mb-10 relative">
            
            {/* INPUT EMAIL */}
            <div className={`relative h-[64px] border rounded-2xl transition-all duration-400 flex items-center bg-white/80 backdrop-blur-[10px] ${isFocused === 'email' ? 'border-apple-blue shadow-[0_0_0_4px_rgba(0,113,227,0.12),0_10px_25px_rgba(0,0,0,0.05)] scale-[1.01] bg-white' : 'border-[#d2d2d7]'} ${errorShake && step === 'email' ? 'animate-[shake_0.4s_cubic-bezier(0.36,0.07,0.19,0.97)_both] border-[#ff3b30]' : ''} ${step === 'password' ? 'bg-[#f5f5f7] border-transparent' : ''}`}>
              <label className={`absolute left-[18px] text-[18px] pointer-events-none transition-all duration-300 origin-top-left ${isFocused === 'email' || email.length > 0 ? '-translate-y-3 scale-75 text-apple-gray font-medium top-[22px]' : 'text-apple-gray top-[22px]'}`}>Email hoặc Số điện thoại</label>
              <input 
                ref={inputRef}
                type="text" 
                className={`w-full h-full border-none bg-transparent pt-6 px-4 pb-2 text-[18px] rounded-2xl outline-none ${step === 'password' ? 'text-apple-gray' : 'text-apple-dark'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused('email')}
                onBlur={() => setIsFocused(null)}
                disabled={step === 'password'} 
              />
              {step === 'email' && <ArrowButton isValid={isEmailValid} />}
            </div>

            {/* INPUT PASSWORD (Slide Down) */}
            <div className={`overflow-hidden transition-all duration-500 origin-top ${step === 'password' ? 'max-h-[100px] opacity-100 translate-y-0 mt-4' : 'max-h-0 opacity-0 -translate-y-2.5'}`}>
              <div className={`relative h-[64px] border rounded-2xl transition-all duration-400 flex items-center bg-white/80 backdrop-blur-[10px] ${isFocused === 'password' ? 'border-apple-blue shadow-[0_0_0_4px_rgba(0,113,227,0.12),0_10px_25px_rgba(0,0,0,0.05)] scale-[1.01] bg-white' : 'border-[#d2d2d7]'} ${errorShake && step === 'password' ? 'animate-[shake_0.4s_cubic-bezier(0.36,0.07,0.19,0.97)_both] border-[#ff3b30]' : ''}`}>
                <label className={`absolute left-[18px] text-[18px] pointer-events-none transition-all duration-300 origin-top-left ${isFocused === 'password' || password.length > 0 ? '-translate-y-3 scale-75 text-apple-gray font-medium top-[22px]' : 'text-apple-gray top-[22px]'}`}>Mật khẩu</label>
                <input 
                  ref={passwordRef}
                  type="password" 
                  className="w-full h-full border-none bg-transparent pt-6 px-4 pb-2 text-[18px] text-apple-dark rounded-2xl outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                />
                {step === 'password' && <ArrowButton isValid={isPasswordValid} />}
              </div>
            </div>

          </div>

          <div className="max-w-[440px] mx-auto opacity-0 animate-[fadeInUp_0.8s_cubic-bezier(0.25,0.8,0.25,1)_0.4s_forwards]">
            
            {step === 'password' ? (
               <div className="text-center mb-[15px]">
                  <span className="text-[14px] text-[#6e6e73]">Đang đăng nhập: <b>{email}</b></span> 
                  <button 
                    type="button" 
                    onClick={handleEditEmail} 
                    className="border-none bg-transparent text-apple-blue cursor-pointer ml-1.5 inline-flex items-center gap-1 hover:underline"
                  >
                    <Edit2 size={12}/> Sửa
                  </button>
               </div>
            ) : (
                <label className="flex items-center justify-center gap-2 cursor-pointer mb-[15px]">
                  <input type="checkbox" className="w-4 h-4 accent-apple-blue cursor-pointer" />
                  <span className="text-[15px] text-apple-dark">Ghi nhớ đăng nhập</span>
                </label>
            )}

            <div className="flex flex-col gap-3 mt-[30px]">
              <a href="/forgot" className="text-apple-blue no-underline text-[15px] font-medium inline-flex items-center justify-center transition-opacity hover:underline group">
                Quên mật khẩu? <span className="ml-1 text-[12px] transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">↗</span>
              </a>
              <div>
                 Chưa có tài khoản? 
                 <a href="/register" className="text-apple-blue no-underline text-[15px] font-medium inline-flex items-center justify-center ml-1.5 transition-opacity hover:underline group">
                   Tạo tài khoản CodeStore <span className="ml-1 text-[12px] transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">↗</span>
                 </a>
              </div>
            </div>

          </div>

        </form>
      </div>
      <Footer />
    </AuthLayout>
  );
};

export default LoginPage;
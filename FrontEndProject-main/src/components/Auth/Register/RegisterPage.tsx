import { ChevronDown, Loader2 } from 'lucide-react';
import { useRegister } from './useRegister';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import AuthLayout from '../AuthLayout';
import GoogleLoginButton from '../GoogleLoginButton';

const RegisterPage = () => {
    const { 
        formData, 
        loading, 
        handleChange, 
        handleBirthdayChange, 
        handleRegister 
    } = useRegister();

    return (
        <AuthLayout>
            <Header />

            <div className="w-full max-w-[980px] mx-auto text-center py-10 px-5">
                <div className="mb-[50px] max-w-[600px] mx-auto">
                    <h1 className="text-[48px] leading-[1.08] font-bold text-apple-dark mb-4 tracking-[-0.003em]">Tạo Tài Khoản Code Store</h1>
                    <p className="text-[19px] leading-[1.42] font-normal text-apple-dark">
                        Một Tài Khoản Code Store là tất cả những gì bạn cần để truy cập mọi dịch vụ của Code Store. <br />
                        Đã có Tài Khoản? <a href="/login" className="text-apple-blue font-medium no-underline ml-1 hover:underline">Đăng nhập tại đây &rsaquo;</a>
                    </p>
                </div>

                <form onSubmit={handleRegister}>
                    <div className="max-w-[560px] mx-auto">
                        
                        {/* --- HỌ TÊN --- */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6]">
                                    <input 
                                        type="text" className="w-full h-full border-none bg-transparent px-4 text-[17px] text-apple-dark rounded-xl outline-none placeholder-[#a1a1a6]" placeholder="Họ" 
                                        name="firstName" value={formData.firstName} onChange={handleChange} required
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6]">
                                    <input 
                                        type="text" className="w-full h-full border-none bg-transparent px-4 text-[17px] text-apple-dark rounded-xl outline-none placeholder-[#a1a1a6]" placeholder="Tên" 
                                        name="lastName" value={formData.lastName} onChange={handleChange} required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- QUỐC GIA --- */}
                        <div className="mb-3.5 text-left">
                            <label className="text-[19px] leading-[1.2] font-semibold text-apple-dark block">QUỐC GIA / KHU VỰC</label>
                        </div>
                        <div className="flex mb-6">
                            <div className="relative w-full h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6] group">
                                <select className="w-full h-full border-none bg-transparent pl-[18px] pr-10 text-[17px] text-apple-dark appearance-none rounded-xl outline-none cursor-pointer" name="country" value={formData.country} onChange={handleChange}>
                                    <option value="Vietnam">Việt Nam</option>
                                    <option value="United States">United States</option>
                                    <option value="Singapore">Singapore</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 pointer-events-none text-apple-gray transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-apple-blue" />
                            </div>
                        </div>

                        {/* --- NGÀY SINH --- */}
                        <div className="mb-3.5 text-left">
                            <label className="text-[19px] leading-[1.2] font-semibold text-apple-dark block">NGÀY SINH</label>
                        </div>
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6] group">
                                    <select className="w-full h-full border-none bg-transparent pl-[18px] pr-10 text-[17px] text-apple-dark appearance-none rounded-xl outline-none cursor-pointer" name="month" value={formData.birthday.month} onChange={handleBirthdayChange} required>
                                        <option value="" disabled>Tháng</option>
                                        {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>Tháng {i + 1}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 pointer-events-none text-apple-gray transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-apple-blue" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6] group">
                                    <select className="w-full h-full border-none bg-transparent pl-[18px] pr-10 text-[17px] text-apple-dark appearance-none rounded-xl outline-none cursor-pointer" name="day" value={formData.birthday.day} onChange={handleBirthdayChange} required>
                                        <option value="" disabled>Ngày</option>
                                        {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 pointer-events-none text-apple-gray transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-apple-blue" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6] group">
                                    <select className="w-full h-full border-none bg-transparent pl-[18px] pr-10 text-[17px] text-apple-dark appearance-none rounded-xl outline-none cursor-pointer" name="year" value={formData.birthday.year} onChange={handleBirthdayChange} required>
                                        <option value="" disabled>Năm</option>
                                        {[...Array(100)].map((_, i) => <option key={i} value={2024 - i}>{2024 - i}</option>)}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 pointer-events-none text-apple-gray transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-apple-blue" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-[#e5e5e5] max-w-[560px] mx-auto my-10"></div>

                        {/* --- EMAIL & PASSWORD --- */}
                        <div className="mb-6">
                            <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6] mb-5">
                                <input 
                                    type="email" className="w-full h-full border-none bg-transparent px-4 text-[17px] text-apple-dark rounded-xl outline-none placeholder-[#a1a1a6]" placeholder="name@example.com" 
                                    name="email" value={formData.email} onChange={handleChange} required
                                />
                                <span className="absolute right-4 text-[12px] text-apple-gray pointer-events-none">Đây sẽ là ID mới của bạn.</span>
                            </div>

                            <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6] mb-5">
                                <input 
                                    type="password" className="w-full h-full border-none bg-transparent px-4 text-[17px] text-apple-dark rounded-xl outline-none placeholder-[#a1a1a6]" placeholder="Mật khẩu" 
                                    name="password" value={formData.password} onChange={handleChange} required
                                />
                            </div>

                            <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6]">
                                <input 
                                    type="password" className="w-full h-full border-none bg-transparent px-4 text-[17px] text-apple-dark rounded-xl outline-none placeholder-[#a1a1a6]" placeholder="Xác nhận mật khẩu" 
                                    name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        <div className="h-px bg-[#e5e5e5] max-w-[560px] mx-auto my-10"></div>

                        {/* --- PHONE --- */}
                        <div className="mb-3.5 text-left">
                            <label className="text-[19px] leading-[1.2] font-semibold text-apple-dark block">SỐ ĐIỆN THOẠI</label>
                        </div>
                        <div className="flex gap-4 mb-6">
                            <div className="flex-none w-[100px]">
                                <div className="relative w-full h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6] group">
                                    <select className="w-full h-full border-none bg-transparent pl-4 pr-8 text-[17px] text-apple-dark appearance-none rounded-xl outline-none cursor-pointer" defaultValue="+84">
                                        <option value="+84">+84 (VN)</option>
                                        <option value="+1">+1 (US)</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-3 pointer-events-none text-apple-gray transition-transform duration-300 group-focus-within:rotate-180 group-focus-within:text-apple-blue" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="relative h-[58px] border border-[#d2d2d7] rounded-xl bg-white flex items-center transition-all duration-300 focus-within:border-apple-blue focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus-within:scale-[1.005] hover:border-[#a1a1a6]">
                                    <input 
                                        type="tel" className="w-full h-full border-none bg-transparent px-4 text-[17px] text-apple-dark rounded-xl outline-none placeholder-[#a1a1a6]" placeholder="Số điện thoại" 
                                        name="phone" value={formData.phone} onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 text-left mb-[30px] mt-5">
                            <label className="flex items-center gap-3 cursor-pointer py-2">
                                <input type="radio" name="verifyMethod" value="sms" 
                                    checked={formData.verifyMethod === 'sms'} onChange={handleChange} className="w-5 h-5 accent-apple-blue cursor-pointer" 
                                />
                                <span className="text-[17px] text-apple-dark">Tin nhắn văn bản</span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer py-2">
                                <input type="radio" name="verifyMethod" value="call" 
                                    checked={formData.verifyMethod === 'call'} onChange={handleChange} className="w-5 h-5 accent-apple-blue cursor-pointer" 
                                />
                                <span className="text-[17px] text-apple-dark">Cuộc gọi điện thoại</span>
                            </label>
                        </div>

                        <div className="h-px bg-[#e5e5e5] max-w-[560px] mx-auto my-10"></div>

                        {/* --- CAPTCHA --- */}
                        <div className="mb-3.5 text-left">
                            <label className="text-[19px] leading-[1.2] font-semibold text-apple-dark block">NHẬP KÝ TỰ TRONG ẢNH</label>
                        </div>
                        <div className="flex gap-4 items-center border border-[#d2d2d7] p-3 rounded-xl bg-[#fbfbfb] mb-[30px]">
                            <div className="flex-1 h-[64px] bg-[#f0f0f0] rounded-lg flex items-center justify-center font-mono text-[28px] tracking-[6px] text-[#333] font-bold line-through select-none" style={{ backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.05) 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}>
                                XK49
                            </div>
                            <div className="relative flex-1 h-10 flex items-center transition-all duration-300 border-none">
                                <input 
                                    type="text" className="w-full h-full border-none bg-transparent px-2.5 text-[17px] text-apple-dark outline-none placeholder-[#a1a1a6]" placeholder="Nhập mã" 
                                    name="captcha" value={formData.captcha} onChange={handleChange} required
                                />
                            </div>
                        </div>

                        {/* --- BUTTON SUBMIT --- */}
                        <div className="text-center mb-[60px] mt-10">
                            <button type="submit" className="w-full max-w-[320px] p-[18px] bg-apple-blue text-white text-[17px] font-semibold border-none rounded-xl cursor-pointer transition-all duration-200 shadow-[0_4px_10px_rgba(0,113,227,0.2)] hover:bg-[#0077ed] hover:shadow-[0_6px_15px_rgba(0,113,227,0.3)] hover:-translate-y-px active:translate-y-px active:scale-98 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed mx-auto block" disabled={loading}>
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2.5">
                                        <Loader2 className="animate-spin" size={20} /> Đang xử lý...
                                    </div>
                                ) : (
                                    "Tiếp tục"
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Google OAuth */}
                <div className="max-w-[480px] mx-auto w-full">
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-[#d2d2d7]"></div>
                        <span className="text-[13px] text-apple-gray font-medium">hoặc đăng ký nhanh</span>
                        <div className="flex-1 h-px bg-[#d2d2d7]"></div>
                    </div>
                    <GoogleLoginButton
                        redirectTo="/"
                        onError={(msg) => alert(msg)}
                    />
                </div>

            </div>

            <Footer />
        </AuthLayout>
    );
};

export default RegisterPage;
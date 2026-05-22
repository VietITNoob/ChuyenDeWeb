import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../service/userService';

const EditProfilePage = () => {
  const { user, loginWithData, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#f5f5f7]">
        <Loader2 className="animate-spin text-apple-gray" size={40} />
      </div>
    );
  }

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setErrorMsg('Họ và tên không được để trống.');
      setIsSaving(false);
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Email không được để trống.');
      setIsSaving(false);
      return;
    }

    try {
      const updatedUser = await userService.updateProfile({ name: name.trim(), email: email.trim() });
      
      // Cập nhật state local trong AuthContext bằng cách gọi loginWithData
      const token = localStorage.getItem('accessToken') || '';
      loginWithData({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email
      }, token);

      setSuccessMsg('Cập nhật thông tin tài khoản thành công!');
      setTimeout(() => {
        navigate('/account/home');
      }, 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin.';
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-[60px] font-sans text-apple-dark bg-[#f5f5f7]">
      <Header />

      <div className="max-w-[580px] mx-auto px-5 pt-[100px] pb-10">
        
        {/* --- BACK BUTTON --- */}
        <button 
          onClick={() => navigate('/account/home')}
          className="flex items-center gap-1.5 text-[14px] text-apple-gray bg-transparent border-none cursor-pointer p-0 hover:text-apple-blue transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Quay lại trang cá nhân
        </button>

        {/* --- CARD FORM --- */}
        <div className="bg-white rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5">
          <div className="mb-6">
            <h1 className="text-[24px] font-bold tracking-tight text-apple-dark m-0">
              Thông tin tài khoản
            </h1>
            <p className="text-[14px] text-apple-gray mt-1 m-0">
              Chỉnh sửa thông tin cá nhân của bạn trên CodeStore.
            </p>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-[14px] rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-700 text-[14px] rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field: Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-[13px] font-medium text-apple-dark mb-1.5 ml-1">
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#d2d2d7] bg-white text-[15px] outline-none transition-all focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20"
                placeholder="Nhập họ và tên của bạn"
                disabled={isSaving}
              />
            </div>

            {/* Field: Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-[13px] font-medium text-apple-dark mb-1.5 ml-1">
                Địa chỉ Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#d2d2d7] bg-white text-[15px] outline-none transition-all focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20"
                placeholder="example@domain.com"
                disabled={isSaving}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full mt-2 bg-apple-blue hover:bg-[#0077ed] text-white py-3 px-4 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_8px_rgba(0,113,227,0.15)] hover:shadow-[0_4px_16px_rgba(0,113,227,0.3)] transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Đang lưu thay đổi...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditProfilePage;

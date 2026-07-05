import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, Package, LogOut, LayoutDashboard } from 'lucide-react';

import UserList from './components/UserList';
import ProductApproval from './components/ProductApproval';

const AdminPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'products'>('users');

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'admin') {
        alert('Bạn không có quyền truy cập trang quản trị!');
        navigate('/');
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f7] font-sans">
      {/* SIDEBAR */}
      <aside className="w-[250px] bg-white border-r border-[#e5e5ea] py-6 flex flex-col fixed h-screen z-[100]">
        <Link to="/" className="px-6 pb-6 text-2xl font-bold text-apple-dark no-underline border-b border-[#e5e5ea] mb-6 block">
          CodeStore Admin
        </Link>
        <nav className="flex flex-col gap-2 px-4 flex-1">
          <button 
            className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl text-[15px] font-medium transition-all duration-200 cursor-pointer border-none ${activeTab === 'users' ? 'bg-apple-blue text-white' : 'bg-transparent text-apple-dark hover:bg-[#f5f5f7]'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            Quản lý Người dùng
          </button>
          <button 
            className={`w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl text-[15px] font-medium transition-all duration-200 cursor-pointer border-none ${activeTab === 'products' ? 'bg-apple-blue text-white' : 'bg-transparent text-apple-dark hover:bg-[#f5f5f7]'}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            Duyệt Sản phẩm
          </button>
          
          <div className="flex-1"></div>

          <button 
            className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl text-[15px] font-medium transition-all duration-200 cursor-pointer border-none bg-transparent text-apple-dark hover:bg-[#f5f5f7] mb-2"
            onClick={() => navigate('/')}
          >
            <LayoutDashboard size={20} />
            Về Trang chủ
          </button>
          <button className="w-full text-left flex items-center gap-3 py-3 px-4 rounded-xl text-[15px] font-medium transition-all duration-200 cursor-pointer border-none bg-transparent text-[#ff3b30] hover:bg-[#ffeef0] mt-auto" onClick={logout}>
            <LogOut size={20} />
            Đăng xuất
          </button>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 ml-[250px] p-10 max-w-[calc(100vw-250px)]">
        <header className="mb-8">
          <h1 className="text-[32px] font-bold text-apple-dark mb-2">{activeTab === 'users' ? 'Người dùng' : 'Sản phẩm chờ duyệt'}</h1>
          <p className="text-[16px] text-apple-gray">
            {activeTab === 'users' 
              ? 'Quản lý toàn bộ danh sách tài khoản trong hệ thống CodeStore.' 
              : 'Kiểm duyệt và xuất bản các mã nguồn do Seller đăng lên.'}
          </p>
        </header>

        {activeTab === 'users' && <UserList />}
        {activeTab === 'products' && <ProductApproval />}
      </main>
    </div>
  );
};

export default AdminPage;

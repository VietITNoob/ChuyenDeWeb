import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  BarChart3,
  Gift,
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Users,
  Landmark,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminService, type AdminOverview } from '../../service/adminService';
import { productService } from '../../service/productService';
import type { Product } from '../../types';
import UserList from './components/UserList';
import ProductApproval from './components/ProductApproval';
import AdminVoucherManager from './components/AdminVoucherManager';
import ReviewManager from './components/ReviewManager';
import AdminOrderManager from './components/AdminOrderManager';
import AdminWithdrawManager from './components/AdminWithdrawManager';
import { ConfirmModal } from '../../components/UI/ConfirmModal';
import { useToast } from '../../context/ToastContext';

type AdminTab = 'overview' | 'users' | 'approvals' | 'products' | 'vouchers' | 'reviews' | 'orders' | 'withdrawals';
type Toast = { type: 'success' | 'error'; message: string } | null;

const formatMoney = (value: number) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(value || 0);

const getErrorMessage = (error: any, fallback: string) => {
  return error?.response?.data?.message || error?.message || fallback;
};

const ToastBox = ({ toast }: { toast: Toast }) => {
  if (!toast) return null;

  return (
    <div className={`fixed top-5 right-5 z-[500] rounded-lg px-5 py-3 text-sm font-semibold shadow-lg border ${toast.type === 'success' ? 'bg-white text-[#1e8e3e] border-[#cce8d5]' : 'bg-white text-[#d70015] border-[#ffd0d0]'}`}>
      {toast.message}
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  tone = 'blue',
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: 'blue' | 'green' | 'amber' | 'red';
}) => {
  const colors = {
    blue: 'bg-[#e8f2ff] text-[#0071e3]',
    green: 'bg-[#e6f4ea] text-[#1e8e3e]',
    amber: 'bg-[#fff4d6] text-[#a15c00]',
    red: 'bg-[#ffecec] text-[#d70015]',
  };

  return (
    <div className="bg-white border border-[#e5e5ea] rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#6e6e73]">{label}</p>
          <p className="text-[26px] font-bold text-[#1d1d1f] mt-2">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${colors[tone]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const AdminOverviewPanel = ({ overview }: { overview: AdminOverview | null }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Doanh thu đã thanh toán" value={formatMoney(overview?.totalRevenue || 0)} icon={<BarChart3 size={22} />} />
      <StatCard label="Người dùng" value={overview?.totalUsers || 0} icon={<Users size={22} />} />
      <StatCard label="Seller" value={overview?.totalSellers || 0} icon={<ShieldCheck size={22} />} tone="green" />
      <StatCard label="Đơn đã thanh toán" value={overview?.totalOrders || 0} icon={<ShoppingBag size={22} />} tone="amber" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Tổng source" value={overview?.totalProducts || 0} icon={<Package size={22} />} />
      <StatCard label="Source đã duyệt" value={overview?.approvedProducts || 0} icon={<BadgeCheck size={22} />} tone="green" />
      <StatCard label="Source chờ duyệt" value={overview?.pendingProducts || 0} icon={<RefreshCw size={22} />} tone="amber" />
      <StatCard label="Voucher đang bật" value={overview?.activeVouchers || 0} icon={<Gift size={22} />} tone="blue" />
    </div>
  </div>
);

const AdminProductManager = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Modal States
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approveTargetId, setApproveTargetId] = useState<string | null>(null);

  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [lockTargetProduct, setLockTargetProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Không thể tải danh sách source.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateProductState = (id: string, patch: Partial<Product>) => {
    setProducts((current) => current.map((product) => product._id === id ? { ...product, ...patch } : product));
  };

  const handleApproveClick = (id: string) => {
    setApproveTargetId(id);
    setIsApproveModalOpen(true);
  };

  const confirmApprove = async () => {
    if (!approveTargetId) return;
    const id = approveTargetId;
    setActionId(`approve-${id}`);
    try {
      await productService.approveProduct(id);
      updateProductState(id, { isApproved: true, rejectionReason: '' });
      showToast('Đã duyệt source code thành công!');
    } catch (err: any) {
      showToast(getErrorMessage(err, 'Không thể duyệt source.'), 'error');
    } finally {
      setActionId(null);
      setApproveTargetId(null);
    }
  };

  const handleLockClick = (product: Product) => {
    setLockTargetProduct(product);
    setIsLockModalOpen(true);
  };

  const confirmLock = async () => {
    if (!lockTargetProduct) return;
    const product = lockTargetProduct;
    const nextLocked = !product.isLocked;
    setActionId(`lock-${product._id}`);
    try {
      await adminService.toggleProductLock(product._id, nextLocked);
      updateProductState(product._id, { isLocked: nextLocked });
      showToast(nextLocked ? 'Đã khóa source code thành công!' : 'Đã mở khóa source code thành công!');
    } catch (err: any) {
      showToast(getErrorMessage(err, 'Không thể cập nhật trạng thái source.'), 'error');
    } finally {
      setActionId(null);
      setLockTargetProduct(null);
    }
  };

  if (loading) {
    return <div className="bg-white border border-[#e5e5ea] rounded-lg p-10 text-center text-[#6e6e73] flex justify-center items-center gap-2"><Loader2 className="animate-spin text-apple-blue" size={20} /> Đang tải source...</div>;
  }

  if (error) {
    return <div className="bg-white border border-[#ffd0d0] rounded-lg p-5 text-[#d70015]">{error}</div>;
  }

  return (
    <div className="bg-white border border-[#e5e5ea] rounded-lg overflow-x-auto p-5">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#e5e5ea] bg-[#f9f9fb]">
            <th className="p-4 text-sm text-[#6e6e73]">Source</th>
            <th className="p-4 text-sm text-[#6e6e73]">Seller</th>
            <th className="p-4 text-sm text-[#6e6e73]">Giá</th>
            <th className="p-4 text-sm text-[#6e6e73]">Nền tảng</th>
            <th className="p-4 text-sm text-[#6e6e73]">Duyệt</th>
            <th className="p-4 text-sm text-[#6e6e73]">Bán hàng</th>
            <th className="p-4 text-sm text-[#6e6e73]">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const approving = actionId === `approve-${product._id}`;
            const locking = actionId === `lock-${product._id}`;

            return (
              <tr key={product._id} className="border-b border-[#f2f2f2] last:border-b-0 hover:bg-[#f9f9fb] transition-colors">
                <td className="p-4">
                  <div className="font-semibold text-[#1d1d1f]">{product.title}</div>
                  <div className="text-sm text-[#6e6e73]">{product.language}</div>
                </td>
                <td className="p-4 text-[#1d1d1f]">
                  {typeof product.seller === 'object' ? product.seller.name : product.seller}
                </td>
                <td className="p-4 whitespace-nowrap">{formatMoney(Number(product.price))}</td>
                <td className="p-4">{product.platform}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ${product.isApproved ? 'bg-[#e6f4ea] text-[#1e8e3e]' : product.rejectionReason ? 'bg-[#ffecec] text-[#d70015]' : 'bg-[#fff4d6] text-[#a15c00]'}`}>
                    {product.isApproved ? 'Đã duyệt' : product.rejectionReason ? 'Bị từ chối' : 'Chờ duyệt'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ${product.isLocked ? 'bg-[#ffecec] text-[#d70015]' : 'bg-[#e6f4ea] text-[#1e8e3e]'}`}>
                    {product.isLocked ? 'Đã khóa' : 'Đang bán'}
                  </span>
                </td>
                <td className="p-4 text-apple-dark align-middle">
                  <div className="flex gap-2">
                    {!product.isApproved && (
                      <button
                        type="button"
                        onClick={() => handleApproveClick(product._id)}
                        disabled={!!actionId}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#0071e3] text-white px-3 py-2 text-sm font-semibold disabled:opacity-60 hover:bg-[#0077ed] active:scale-95 transition-all cursor-pointer"
                      >
                        {approving && <Loader2 size={14} className="animate-spin" />}
                        Duyệt
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleLockClick(product)}
                      disabled={!!actionId}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#fff0ef] text-[#d70015] px-3 py-2 text-sm font-semibold disabled:opacity-60 hover:bg-[#ffcdd2] active:scale-95 transition-all cursor-pointer"
                    >
                      {locking && <Loader2 size={14} className="animate-spin" />}
                      {product.isLocked ? 'Mở khóa' : 'Khóa'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {products.length === 0 && <div className="p-8 text-center text-[#6e6e73]">Chưa có source nào.</div>}

      {/* ConfirmModal for Locking */}
      <ConfirmModal
        isOpen={isLockModalOpen}
        onClose={() => {
          setIsLockModalOpen(false);
          setLockTargetProduct(null);
        }}
        onConfirm={confirmLock}
        title={lockTargetProduct?.isLocked ? "Mở khóa sản phẩm" : "Khóa sản phẩm"}
        message={lockTargetProduct?.isLocked 
          ? "Bạn có chắc chắn muốn mở khóa sản phẩm này để tiếp tục bán công khai không?" 
          : "Bạn có chắc chắn muốn khóa sản phẩm này lại không? Người mua sẽ không thể tìm thấy hoặc mua sản phẩm này."}
        confirmText={lockTargetProduct?.isLocked ? "Mở khóa" : "Khóa sản phẩm"}
        isDanger={!lockTargetProduct?.isLocked}
      />

      {/* ConfirmModal for Approving */}
      <ConfirmModal
        isOpen={isApproveModalOpen}
        onClose={() => {
          setIsApproveModalOpen(false);
          setApproveTargetId(null);
        }}
        onConfirm={confirmApprove}
        title="Duyệt sản phẩm"
        message="Duyệt sản phẩm này để đăng bán công khai trên hệ thống?"
        confirmText="Duyệt sản phẩm"
      />
    </div>
  );
};

const AdminPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const loadOverview = async () => {
    setOverviewLoading(true);
    try {
      const data = await adminService.getOverview();
      setOverview(data);
    } catch (err: any) {
      showToast(getErrorMessage(err, 'Không thể tải tổng quan.'), 'error');
    } finally {
      setOverviewLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadOverview();
    }
  }, [user]);

  const pageTitle = useMemo(() => {
    const titles: Record<AdminTab, string> = {
      overview: 'Tổng quan quản trị',
      users: 'Quản lý khách hàng',
      approvals: 'Duyệt nội dung đăng bán',
      products: 'Quản lý source code',
      vouchers: 'Quản lý voucher',
      reviews: 'Quản lý đánh giá',
      orders: 'Quản lý đơn hàng',
      withdrawals: 'Quản lý rút tiền (Seller)',
    };
    return titles[activeTab];
  }, [activeTab]);

  if (isLoading || !user || user.role !== 'admin') {
    return null;
  }

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: 'overview', label: 'Tổng quan', icon: <LayoutDashboard size={19} /> },
    { id: 'users', label: 'Khách hàng', icon: <Users size={19} /> },
    { id: 'approvals', label: 'Duyệt đăng bán', icon: <BadgeCheck size={19} /> },
    { id: 'products', label: 'Source code', icon: <Package size={19} /> },
    { id: 'vouchers', label: 'Voucher', icon: <Gift size={19} /> },
    { id: 'reviews', label: 'Đánh giá', icon: <Star size={19} /> },
    { id: 'orders', label: 'Đơn hàng', icon: <ShoppingBag size={19} /> },
    { id: 'withdrawals', label: 'Yêu cầu rút tiền', icon: <Landmark size={19} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex font-sans">
      <ToastBox toast={toast} />
      <aside className="w-[260px] bg-white border-r border-[#e5e5ea] fixed left-0 top-0 h-screen p-5 flex flex-col">
        <Link to="/" className="text-2xl font-bold text-[#1d1d1f] mb-7">
          CodeStore Admin
        </Link>

        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left font-semibold ${activeTab === tab.id ? 'bg-[#0071e3] text-white' : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <button type="button" onClick={() => navigate('/')} className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left font-semibold text-[#1d1d1f] hover:bg-[#f5f5f7]">
          <LayoutDashboard size={19} />
          Về trang chủ
        </button>
        <button type="button" onClick={logout} className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left font-semibold text-[#d70015] hover:bg-[#ffecec]">
          <LogOut size={19} />
          Đăng xuất
        </button>
      </aside>

      <main className="ml-[260px] w-[calc(100%-260px)] p-8">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1d1d1f]">{pageTitle}</h1>
            <p className="text-[#6e6e73] mt-1">Theo dõi người dùng, seller, source code, voucher và doanh thu.</p>
          </div>
          <button type="button" onClick={loadOverview} className="inline-flex items-center gap-2 rounded-lg bg-white border border-[#d2d2d7] px-4 py-2 font-semibold">
            <RefreshCw size={17} />
            Tải lại
          </button>
        </header>

        {activeTab === 'overview' && (
          overviewLoading ? (
            <div className="bg-white border border-[#e5e5ea] rounded-lg p-10 text-center text-[#6e6e73]">Đang tải tổng quan...</div>
          ) : (
            <AdminOverviewPanel overview={overview} />
          )
        )}
        {activeTab === 'users' && <UserList />}
        {activeTab === 'approvals' && <ProductApproval />}
        {activeTab === 'products' && <AdminProductManager />}
        {activeTab === 'vouchers' && <AdminVoucherManager />}
        {activeTab === 'reviews' && <ReviewManager />}
        {activeTab === 'orders' && <AdminOrderManager />}
        {activeTab === 'withdrawals' && <AdminWithdrawManager />}
      </main>
    </div>
  );
};

export default AdminPage;

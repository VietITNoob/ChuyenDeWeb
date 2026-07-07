import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    CheckCircle2,
    FileArchive,
    Gift,
    LayoutDashboard,
    Loader2,
    LogOut,
    Package,
    Plus,
    Tag,
    Upload,
    Landmark,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService, type CreateProductData } from '../../service/productService';
import { sellerService, type MonthlyRevenueItem, type SellerOverview } from '../../service/sellerService';
import { uploadService } from '../../service/uploadService';
import { voucherService, type VoucherPayload } from '../../service/voucherService';
import type { Product, Voucher } from '../../types';
import WithdrawPanel from './components/WithdrawPanel';

type SellerTab = 'overview' | 'create' | 'products' | 'vouchers' | 'stats' | 'withdraw';

const money = (value: number) => new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
}).format(value || 0);

const statusLabel = (product: Product) => {
    if (product.isApproved) return 'Da duyet';
    if (product.rejectionReason) return 'Bi tu choi';
    return 'Cho duyet';
};

const StatCard = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-white border border-[#e5e5ea] rounded-lg p-5">
        <div className="flex items-center justify-between gap-4">
            <div>
                <p className="text-sm text-[#6e6e73]">{label}</p>
                <p className="text-2xl font-bold text-[#1d1d1f] mt-2">{value}</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-[#f5f5f7] flex items-center justify-center text-[#0071e3]">
                {icon}
            </div>
        </div>
    </div>
);

const SellerOverviewPanel = ({ overview }: { overview: SellerOverview | null }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Tong doanh thu" value={money(overview?.totalRevenue || 0)} icon={<BarChart3 size={22} />} />
        <StatCard label="Luot ban" value={overview?.totalSold || 0} icon={<CheckCircle2 size={22} />} />
        <StatCard label="Source da dang" value={overview?.totalProducts || 0} icon={<Package size={22} />} />
        <StatCard label="Voucher dang bat" value={overview?.activeVouchers || 0} icon={<Gift size={22} />} />
        <StatCard label="Da duyet" value={overview?.approvedProducts || 0} icon={<CheckCircle2 size={22} />} />
        <StatCard label="Cho duyet" value={overview?.pendingProducts || 0} icon={<Upload size={22} />} />
        <StatCard label="Bi tu choi" value={overview?.rejectedProducts || 0} icon={<Tag size={22} />} />
        <StatCard label="Tong voucher" value={overview?.totalVouchers || 0} icon={<Gift size={22} />} />
    </div>
);

const ProductCreatePanel = ({ onCreated }: { onCreated: () => void }) => {
    const [form, setForm] = useState<CreateProductData>({
        title: '',
        description: '',
        price: 0,
        language: '',
        platform: 'Web',
        image: '',
        sourceCodeFile: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [sourceFile, setSourceFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (field: keyof CreateProductData, value: string | number) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            let image = form.image;
            let sourceCodeFile = form.sourceCodeFile;

            if (imageFile) {
                image = await uploadService.uploadImage(imageFile);
            }

            if (sourceFile) {
                sourceCodeFile = await uploadService.uploadSourceCode(sourceFile);
            }

            await productService.createProduct({
                ...form,
                image,
                sourceCodeFile,
                price: Number(form.price),
            });

            setMessage('Da gui source len he thong. San pham dang cho admin duyet.');
            setForm({
                title: '',
                description: '',
                price: 0,
                language: '',
                platform: 'Web',
                image: '',
                sourceCodeFile: '',
            });
            setImageFile(null);
            setSourceFile(null);
            onCreated();
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Khong the tao san pham.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5ea] rounded-lg p-6 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-sm font-medium text-[#1d1d1f]">Ten source</span>
                    <input className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-[#0071e3]" value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
                </label>
                <label className="block">
                    <span className="text-sm font-medium text-[#1d1d1f]">Gia ban</span>
                    <input type="number" min={0} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-[#0071e3]" value={form.price} onChange={(e) => handleChange('price', Number(e.target.value))} required />
                </label>
                <label className="block">
                    <span className="text-sm font-medium text-[#1d1d1f]">Ngon ngu</span>
                    <input className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-[#0071e3]" value={form.language} onChange={(e) => handleChange('language', e.target.value)} required />
                </label>
                <label className="block">
                    <span className="text-sm font-medium text-[#1d1d1f]">Nen tang</span>
                    <select className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-[#0071e3] bg-white" value={form.platform} onChange={(e) => handleChange('platform', e.target.value)}>
                        <option value="Web">Web</option>
                        <option value="Mobile">Mobile</option>
                        <option value="UI">UI</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
            </div>

            <label className="block">
                <span className="text-sm font-medium text-[#1d1d1f]">Mo ta</span>
                <textarea className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-[#0071e3]" rows={5} value={form.description} onChange={(e) => handleChange('description', e.target.value)} required />
            </label>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-sm font-medium text-[#1d1d1f]">Anh san pham</span>
                    <input type="file" accept="image/*" className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    <input className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-[#0071e3]" placeholder="Hoac nhap URL anh" value={form.image} onChange={(e) => handleChange('image', e.target.value)} />
                </label>
                <label className="block">
                    <span className="text-sm font-medium text-[#1d1d1f]">File source code</span>
                    <input type="file" accept=".zip,.rar,.7z" className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" onChange={(e) => setSourceFile(e.target.files?.[0] || null)} />
                    <input className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-[#0071e3]" placeholder="Hoac nhap URL file" value={form.sourceCodeFile} onChange={(e) => handleChange('sourceCodeFile', e.target.value)} />
                </label>
            </div>

            {message && <p className="text-sm text-[#1d1d1f]">{message}</p>}

            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-[#0071e3] text-white px-5 py-3 font-semibold disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Dang source
            </button>
        </form>
    );
};

const ProductListPanel = ({ products }: { products: Product[] }) => (
    <div className="bg-white border border-[#e5e5ea] rounded-lg overflow-x-auto">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-[#e5e5ea]">
                    <th className="p-4 text-sm text-[#6e6e73]">Source</th>
                    <th className="p-4 text-sm text-[#6e6e73]">Gia</th>
                    <th className="p-4 text-sm text-[#6e6e73]">Nen tang</th>
                    <th className="p-4 text-sm text-[#6e6e73]">Trang thai</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product._id} className="border-b border-[#f2f2f2] last:border-b-0">
                        <td className="p-4">
                            <div className="font-semibold text-[#1d1d1f]">{product.title}</div>
                            <div className="text-sm text-[#6e6e73]">{product.language}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">{money(product.price)}</td>
                        <td className="p-4">{product.platform}</td>
                        <td className="p-4">
                            <span className="inline-flex rounded-lg bg-[#f5f5f7] px-2.5 py-1 text-sm text-[#1d1d1f]">{statusLabel(product)}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {products.length === 0 && <div className="p-8 text-center text-[#6e6e73]">Chua co source nao.</div>}
    </div>
);

const VoucherPanel = ({ products, vouchers, onChanged }: { products: Product[]; vouchers: Voucher[]; onChanged: () => void }) => {
    const [form, setForm] = useState<VoucherPayload>({
        code: '',
        discountType: 'percent',
        discountValue: 10,
        applicableProducts: [],
        startDate: '',
        endDate: '',
        usageLimit: 100,
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    const toggleProduct = (productId: string) => {
        setForm((current) => ({
            ...current,
            applicableProducts: current.applicableProducts.includes(productId)
                ? current.applicableProducts.filter((id) => id !== productId)
                : [...current.applicableProducts, productId],
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await voucherService.createVoucher({
                ...form,
                code: form.code.trim().toUpperCase(),
                discountValue: Number(form.discountValue),
                usageLimit: Number(form.usageLimit),
            });
            setForm({
                code: '',
                discountType: 'percent',
                discountValue: 10,
                applicableProducts: [],
                startDate: '',
                endDate: '',
                usageLimit: 100,
                isActive: true,
            });
            setMessage('Da tao voucher. Voucher dang cho admin duyet.');
            onChanged();
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Khong the tao voucher.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (voucher: Voucher) => {
        setActionId(`toggle-${voucher._id}`);
        setMessage('');
        try {
            await voucherService.toggleVoucher(voucher._id, !voucher.isActive);
            setMessage(voucher.isActive ? 'Da tat voucher.' : 'Da bat voucher.');
            onChanged();
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Khong the cap nhat voucher.');
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Xoa voucher nay?')) return;
        setActionId(`delete-${id}`);
        setMessage('');
        try {
            await voucherService.deleteVoucher(id);
            setMessage('Da xoa voucher.');
            onChanged();
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Khong the xoa voucher.');
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-5">
            <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5ea] rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-[#1d1d1f]">Tao voucher</h2>
                <label className="block">
                    <span className="text-sm font-medium">Ma voucher</span>
                    <input className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 uppercase" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                        <span className="text-sm font-medium">Kieu giam</span>
                        <select className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 bg-white" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percent' | 'fixed' })}>
                            <option value="percent">Phan tram</option>
                            <option value="fixed">So tien</option>
                        </select>
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium">Gia tri</span>
                        <input type="number" min={0} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} required />
                    </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                        <span className="text-sm font-medium">Bat dau</span>
                        <input type="date" className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium">Ket thuc</span>
                        <input type="date" className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                    </label>
                </div>
                <label className="block">
                    <span className="text-sm font-medium">Gioi han luot dung</span>
                    <input type="number" min={1} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} required />
                </label>
                <div>
                    <p className="text-sm font-medium text-[#1d1d1f] mb-2">Ap dung cho san pham</p>
                    <div className="max-h-[220px] overflow-auto rounded-lg border border-[#e5e5ea] divide-y divide-[#f2f2f2]">
                        {products.map((product) => (
                            <label key={product._id} className="flex items-center gap-3 p-3 cursor-pointer">
                                <input type="checkbox" checked={form.applicableProducts.includes(product._id)} onChange={() => toggleProduct(product._id)} />
                                <span className="text-sm text-[#1d1d1f]">{product.title}</span>
                            </label>
                        ))}
                        {products.length === 0 && <div className="p-3 text-sm text-[#6e6e73]">Can co san pham truoc khi tao voucher.</div>}
                    </div>
                </div>
                {message && <p className="text-sm text-[#1d1d1f]">{message}</p>}
                <button type="submit" disabled={loading || products.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-[#0071e3] text-white px-5 py-3 font-semibold disabled:opacity-60">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Gift size={18} />}
                    Tao voucher
                </button>
            </form>

            <div className="bg-white border border-[#e5e5ea] rounded-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#e5e5ea]">
                            <th className="p-4 text-sm text-[#6e6e73]">Ma</th>
                            <th className="p-4 text-sm text-[#6e6e73]">Giam</th>
                                <th className="p-4 text-sm text-[#6e6e73]">San pham ap dung</th>
                                <th className="p-4 text-sm text-[#6e6e73]">Duyet</th>
                                <th className="p-4 text-sm text-[#6e6e73]">Luot dung</th>
                            <th className="p-4 text-sm text-[#6e6e73]">Hanh dong</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vouchers.map((voucher) => (
                            <tr key={voucher._id} className="border-b border-[#f2f2f2] last:border-b-0">
                                <td className="p-4 font-semibold">{voucher.code}</td>
                                <td className="p-4">{voucher.discountType === 'percent' ? `${voucher.discountValue}%` : money(voucher.discountValue)}</td>
                                <td className="p-4 text-sm">{voucher.applicableProducts?.map((product) => product.title).join(', ') || 'N/A'}</td>
                                <td className="p-4">
                                    <span className={`inline-flex rounded-lg px-2.5 py-1 text-sm font-semibold ${voucher.status === 'approved' ? 'bg-[#e6f4ea] text-[#1e8e3e]' : voucher.status === 'rejected' ? 'bg-[#ffecec] text-[#d70015]' : 'bg-[#fff4d6] text-[#a15c00]'}`}>
                                        {voucher.status === 'approved' ? 'Da duyet' : voucher.status === 'rejected' ? 'Bi tu choi' : 'Cho duyet'}
                                    </span>
                                </td>
                                <td className="p-4">{voucher.usedCount}/{voucher.usageLimit}</td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button type="button" disabled={!!actionId} className="inline-flex items-center gap-1 rounded-lg bg-[#f5f5f7] px-3 py-2 text-sm disabled:opacity-60" onClick={() => handleToggle(voucher)}>
                                            {actionId === `toggle-${voucher._id}` && <Loader2 size={14} className="animate-spin" />}
                                            {voucher.isActive ? 'Tat' : 'Bat'}
                                        </button>
                                        <button type="button" disabled={!!actionId} className="inline-flex items-center gap-1 rounded-lg bg-[#ffecec] text-[#d70015] px-3 py-2 text-sm disabled:opacity-60" onClick={() => handleDelete(voucher._id)}>
                                            {actionId === `delete-${voucher._id}` && <Loader2 size={14} className="animate-spin" />}
                                            Xoa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {vouchers.length === 0 && <div className="p-8 text-center text-[#6e6e73]">Chua co voucher nao.</div>}
            </div>
        </div>
    );
};

const MonthlyStatsPanel = ({ months }: { months: MonthlyRevenueItem[] }) => {
    const maxRevenue = Math.max(...months.map((item) => item.revenue), 1);

    return (
        <div className="bg-white border border-[#e5e5ea] rounded-lg p-6">
            <div className="flex items-end gap-3 h-[300px]">
                {months.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <div className="text-xs text-[#6e6e73] whitespace-nowrap">{money(item.revenue)}</div>
                        <div className="w-full bg-[#e8f2ff] rounded-t-lg" style={{ height: `${Math.max((item.revenue / maxRevenue) * 220, 8)}px` }} />
                        <div className="text-xs font-semibold text-[#1d1d1f]">T{item.month}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SellerPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<SellerTab>('overview');
    const [overview, setOverview] = useState<SellerOverview | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [months, setMonths] = useState<MonthlyRevenueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const year = useMemo(() => new Date().getFullYear(), []);

    const loadDashboard = async () => {
        setLoading(true);
        setError('');
        try {
            const [overviewData, productsData, vouchersData, monthlyData] = await Promise.all([
                sellerService.getOverview(),
                sellerService.getMyProducts(),
                voucherService.getMyVouchers(),
                sellerService.getMonthlyRevenue(year),
            ]);

            setOverview(overviewData);
            setProducts(productsData);
            setVouchers(vouchersData);
            setMonths(monthlyData.months);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Khong the tai dashboard seller.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const tabs: Array<{ id: SellerTab; label: string; icon: React.ReactNode }> = [
        { id: 'overview', label: 'Tong quan', icon: <LayoutDashboard size={19} /> },
        { id: 'create', label: 'Dang source', icon: <FileArchive size={19} /> },
        { id: 'products', label: 'San pham', icon: <Package size={19} /> },
        { id: 'vouchers', label: 'Voucher', icon: <Gift size={19} /> },
        { id: 'stats', label: 'Doanh so', icon: <BarChart3 size={19} /> },
        { id: 'withdraw', label: 'Rut tien', icon: <Landmark size={19} /> },
    ];

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex">
            <aside className="w-[250px] bg-white border-r border-[#e5e5ea] fixed left-0 top-0 h-screen p-5 flex flex-col">
                <Link to="/" className="text-2xl font-bold text-[#1d1d1f] mb-6">CodeStore Seller</Link>
                <nav className="space-y-2 flex-1">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left font-medium ${activeTab === tab.id ? 'bg-[#0071e3] text-white' : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'}`}>
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]">
                    <LayoutDashboard size={19} />
                    Ve trang chu
                </button>
                <button onClick={logout} className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left font-medium text-[#d70015] hover:bg-[#ffecec]">
                    <LogOut size={19} />
                    Dang xuat
                </button>
            </aside>

            <main className="ml-[250px] w-[calc(100%-250px)] p-8">
                <header className="mb-7 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1d1d1f]">Seller dashboard</h1>
                        <p className="text-[#6e6e73] mt-1">Xin chao, {user?.name}</p>
                    </div>
                    <button onClick={loadDashboard} className="rounded-lg bg-white border border-[#d2d2d7] px-4 py-2 font-medium">Tai lai</button>
                </header>

                {loading && <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[#0071e3]" size={34} /></div>}
                {!loading && error && <div className="bg-white border border-[#ffd0d0] rounded-lg p-5 text-[#d70015]">{error}</div>}
                {!loading && !error && (
                    <>
                        {activeTab === 'overview' && <SellerOverviewPanel overview={overview} />}
                        {activeTab === 'create' && <ProductCreatePanel onCreated={loadDashboard} />}
                        {activeTab === 'products' && <ProductListPanel products={products} />}
                        {activeTab === 'vouchers' && <VoucherPanel products={products} vouchers={vouchers} onChanged={loadDashboard} />}
                        {activeTab === 'stats' && <MonthlyStatsPanel months={months} />}
                        {activeTab === 'withdraw' && <WithdrawPanel />}
                    </>
                )}
            </main>
        </div>
    );
};

export default SellerPage;

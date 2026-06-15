import React, { useEffect, useState } from 'react';
import { productService } from '../../../service/productService';
import type { Product } from '../../../types';
import { Loader2, PackageOpen, CheckCircle } from 'lucide-react';

const ProductApproval: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const data = await productService.getUnapproved();
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách sản phẩm chờ duyệt.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn duyệt sản phẩm này để đăng bán?')) return;
    
    setApprovingId(id);
    try {
      await productService.approveProduct(id);
      setProducts(products.filter(p => p._id !== id));
      alert('Đã duyệt sản phẩm thành công!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi khi duyệt sản phẩm');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-[60px]">
        <Loader2 className="animate-spin text-apple-blue" size={32} />
      </div>
    );
  }

  if (error) {
    return <div className="text-[#ff3b30] p-5">{error}</div>;
  }

  return (
    <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-6 overflow-x-auto">
      {products.length === 0 ? (
        <div className="text-center py-[60px] px-5 text-apple-gray">
          <PackageOpen size={48} className="mx-auto" />
          <h3 className="text-apple-dark mt-4 mb-2 text-lg font-semibold">Tuyệt vời!</h3>
          <p>Hiện không có sản phẩm nào đang chờ duyệt.</p>
        </div>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Hình ảnh</th>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Tên sản phẩm</th>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Giá</th>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Nền tảng / Ngôn ngữ</th>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="last:border-b-0 border-b border-[#e5e5ea]">
                <td className="p-4 text-[15px] text-apple-dark align-middle">
                  <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="p-4 text-[15px] text-apple-dark align-middle font-medium">{product.title}</td>
                <td className="p-4 text-[15px] text-apple-dark align-middle">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}</td>
                <td className="p-4 text-[15px] text-apple-dark align-middle">
                  <div className="text-[13px]">{product.platform}</div>
                  <div className="text-[12px] text-apple-gray">{product.language}</div>
                </td>
                <td className="p-4 text-[15px] text-apple-dark align-middle">
                  <button 
                    className="py-2 px-4 bg-apple-blue text-white border-none rounded-full text-[14px] font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 hover:bg-[#0077ed] hover:scale-102 disabled:bg-[#d2d2d7] disabled:cursor-not-allowed disabled:transform-none" 
                    onClick={() => handleApprove(product._id as string)}
                    disabled={approvingId === product._id}
                  >
                    {approvingId === product._id ? (
                      <><Loader2 size={16} className="animate-spin" /> Đang duyệt...</>
                    ) : (
                      <><CheckCircle size={16} /> Duyệt ngay</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductApproval;

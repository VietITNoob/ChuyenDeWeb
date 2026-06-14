import React, { useEffect, useState } from 'react';
import { Loader2, Star } from 'lucide-react';
import { adminService } from '../../../service/adminService';

interface AdminReview {
  _id: string;
  productId: string;
  productTitle: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

type Toast = { type: 'success' | 'error'; message: string } | null;

const getErrorMessage = (error: any, fallback: string) => {
  return error?.response?.data?.message || error?.message || fallback;
};

const ReviewManager: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<Toast>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getReviews();
      setReviews(data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Không thể tải danh sách đánh giá.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const deleteReview = async (review: AdminReview) => {
    if (!window.confirm('Xóa đánh giá này?')) return;

    setDeletingId(review._id);
    try {
      await adminService.deleteReview(review.productId, review._id);
      setReviews((current) => current.filter((item) => item._id !== review._id));
      showToast('Đã xóa đánh giá.');
    } catch (err: any) {
      showToast(getErrorMessage(err, 'Không thể xóa đánh giá.'), 'error');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-[60px]"><Loader2 className="animate-spin text-apple-blue" size={32} /></div>;
  }

  if (error) {
    return <div className="bg-white border border-[#ffd0d0] rounded-lg p-4 text-[#d70015]">{error}</div>;
  }

  return (
    <div className="relative">
      {toast && (
        <div className={`fixed top-5 right-5 z-[500] rounded-lg px-5 py-3 text-sm font-semibold shadow-lg border ${toast.type === 'success' ? 'bg-white text-[#1e8e3e] border-[#cce8d5]' : 'bg-white text-[#d70015] border-[#ffd0d0]'}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white border border-[#e5e5ea] rounded-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#e5e5ea]">
              <th className="p-4 text-sm text-[#6e6e73]">Source</th>
              <th className="p-4 text-sm text-[#6e6e73]">Người đánh giá</th>
              <th className="p-4 text-sm text-[#6e6e73]">Sao</th>
              <th className="p-4 text-sm text-[#6e6e73]">Nội dung</th>
              <th className="p-4 text-sm text-[#6e6e73]">Ngày</th>
              <th className="p-4 text-sm text-[#6e6e73]">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-b border-[#f2f2f2] last:border-b-0">
                <td className="p-4 font-semibold text-[#1d1d1f]">{review.productTitle}</td>
                <td className="p-4">{review.name}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[#a15c00]">
                    <Star size={15} fill="currentColor" />
                    {review.rating}
                  </span>
                </td>
                <td className="p-4 max-w-[420px]">{review.comment}</td>
                <td className="p-4">{review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                <td className="p-4">
                  <button type="button" disabled={!!deletingId} onClick={() => deleteReview(review)} className="inline-flex items-center gap-1 rounded-lg bg-[#ffecec] text-[#d70015] px-3 py-2 text-sm font-semibold disabled:opacity-60">
                    {deletingId === review._id && <Loader2 size={14} className="animate-spin" />}
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && <div className="p-8 text-center text-[#6e6e73]">Chưa có đánh giá nào.</div>}
      </div>
    </div>
  );
};

export default ReviewManager;

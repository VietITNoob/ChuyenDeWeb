import React, { useState } from "react";
import { useReviews } from "../../../hook/useReviews";
import { useAuth } from "../../../context/AuthContext";
import { Star, Send } from "lucide-react";

interface ReviewsProps {
    productId: number;
}

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
    const { reviews, loading, addReview } = useReviews(productId);
    const { user, isAuthenticated } = useAuth();
    
    const [newReviewContent, setNewReviewContent] = useState("");
    const [newReviewRating, setNewReviewRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !user) {
            alert("Vui lòng đăng nhập để đánh giá sản phẩm.");
            return;
        }
        if (!newReviewContent.trim()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            await addReview({
                userId: user.id,
                productId: productId,
                rating: newReviewRating,
                date: today,
                content: newReviewContent
            });
            setNewReviewContent("");
            setNewReviewRating(5);
        } catch (err) {
            setSubmitError("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (rating: number) =>
        [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-4 h-4 ${i < rating ? "fill-current" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ));

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
            : 0;

    return (
        <section className="py-[100px] bg-white border-t border-[#d2d2d7] reveal">
            <div className="max-w-[1080px] mx-auto px-5">
                <h2 className="text-[36px] font-bold text-center mb-[50px] text-apple-dark">Đánh giá & Nhận xét</h2>

                {loading ? (
                    <p className="text-center text-apple-gray">Đang tải đánh giá...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-center text-apple-gray">Chưa có đánh giá nào</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10 md:gap-[60px] mt-10">
                        <div className="md:sticky md:top-[100px] p-[30px] bg-apple-lightbg rounded-3xl h-fit flex flex-col md:block items-center">
                            <div className="text-center mb-[30px]">
                                <span className="text-[64px] font-bold tracking-[-2px] leading-none text-apple-dark block">
                                    {averageRating.toFixed(1)}
                                </span>
                                <div className="mt-2.5 mb-1.5 text-[#f5a623] flex justify-center gap-0.5">
                                    {renderStars(Math.round(averageRating))}
                                </div>
                                <p className="text-[13px] text-apple-gray mt-2">
                                    dựa trên {reviews.length} đánh giá
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-apple-lightbg p-6 rounded-[20px] transition-all duration-200 hover:bg-[#e8e8ed] hover:-translate-y-0.5">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-[#f5a623] flex gap-0.5">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="text-[12px] text-apple-gray">{review.date}</span>
                                    </div>
                                    <p className="text-[15px] leading-[1.5] text-[#424245] mb-5">{review.content}</p>
                                    <div className="flex flex-col text-[13px]">
                                        <strong className="text-apple-dark">
                                            {review.user
                                                ? `${review.user.firstName ?? ""} ${review.user.lastName ?? ""}`.trim()
                                                : "Người dùng ẩn danh"}
                                        </strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- FORM NHẬP REVIEW --- */}
                <div className="mt-[60px] p-6 bg-white rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-black/5">
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmitReview}>
                            <h3 className="text-[18px] font-semibold mb-4 text-apple-dark">Viết đánh giá của bạn</h3>
                            
                            {/* Rating Input */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[14px] text-apple-gray">Chọn số sao:</span>
                                <div className="flex gap-1 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star 
                                            key={star} 
                                            size={24} 
                                            fill={star <= newReviewRating ? "#f5a623" : "none"} 
                                            color={star <= newReviewRating ? "#f5a623" : "#d2d2d7"}
                                            onClick={() => setNewReviewRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Text Input */}
                            <div className="relative">
                                <textarea
                                    value={newReviewContent}
                                    onChange={(e) => setNewReviewContent(e.target.value)}
                                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                                    className="w-full md:w-[95%] min-h-[100px] p-3 md:px-4 rounded-xl border border-[#d2d2d7] text-[15px] resize-y font-sans bg-white text-black outline-none focus:border-apple-blue transition-colors"
                                    required
                                />
                            </div>

                            {submitError && <p className="text-red-500 text-[13px] mt-2">{submitError}</p>}

                            <div className="mt-4 text-right md:pr-[5%]">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className={`inline-flex items-center gap-2 bg-apple-blue text-white py-3 px-6 rounded-full font-medium transition-all hover:bg-[#0077ed] hover:shadow-[0_4px_12px_rgba(0,113,227,0.3)] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Đang gửi...' : <>Gửi đánh giá <Send size={16} /></>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center p-5">
                            <p className="text-apple-gray mb-3">Vui lòng đăng nhập để viết đánh giá.</p>
                            <a href="/login" className="inline-block bg-apple-lightbg text-apple-dark py-3 px-6 rounded-full font-medium no-underline hover:bg-[#e8e8ed] transition-colors">Đăng nhập ngay</a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Reviews;

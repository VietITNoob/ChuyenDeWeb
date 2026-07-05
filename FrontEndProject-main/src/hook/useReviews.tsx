import { useState, useEffect } from "react";
import type { Review } from "../types";
import { ReviewService, type AddReviewData } from "../service/ReviewService.tsx";

// productId phải là string (MongoDB ObjectId)
export const useReviews = (productId: string) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        if (!productId) {
            setReviews([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const reviewsData = await ReviewService.getByProductId(productId);
            setReviews(reviewsData);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    // addReview nhận { rating, comment } — khớp với API backend
    const addReview = async (reviewData: AddReviewData) => {
        try {
            await ReviewService.addReview(productId, reviewData);
            // Reload lại danh sách review sau khi thêm
            await fetchReviews();
        } catch (error) {
            console.error("Failed to add review", error);
            throw error;
        }
    };

    return { reviews, loading, addReview };
};

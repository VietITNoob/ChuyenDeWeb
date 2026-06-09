import { useState, useEffect } from "react";
import type { Review } from "../types";
import { ReviewService } from "../service/ReviewService.tsx";
import { userService } from "../service/userService.tsx";

export const useReviews = (productId: number) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviewsAndUsers = async () => {
        if (!productId) {
            setReviews([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const reviewsData = await ReviewService.getByProductId(productId);
            const reviewsWithUsers = await Promise.all(
                reviewsData.map(async (review) => {
                    if (review.user) return review;
                    if (review.userId) {
                        try {
                            const user = await userService.getById(review.userId);
                            return { ...review, user };
                        } catch (error) {
                            console.error(`Failed to fetch user ${review.userId}`, error);
                            return review;
                        }
                    }
                    return review;
                })
            );
            
            setReviews(reviewsWithUsers);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviewsAndUsers();
    }, [productId]);

    const addReview = async (reviewData: Omit<Review, 'id' | 'user'>) => {
        try {
            const newReview = await ReviewService.addReview(reviewData);
            // Sau khi thêm, fetch lại user info cho review mới nếu cần, hoặc đơn giản là reload list
            // Ở đây ta sẽ reload lại list để đảm bảo đồng bộ
            await fetchReviewsAndUsers();
            return newReview;
        } catch (error) {
            console.error("Failed to add review", error);
            throw error;
        }
    };

    return { reviews, loading, addReview };
};

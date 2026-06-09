import { useEffect, useState } from "react";
import type { Product } from "../types";
import { productService } from "../service/productService";

// productId là MongoDB ObjectId string (không phải number)
export const useProductDetail = (productId: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const productRes = await productService.getById(productId);
                setProduct(productRes);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        if (productId) {
            fetchData();
        }
    }, [productId]);

    return { product, loading, error };
};
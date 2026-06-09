import { useState, useEffect } from 'react';
import { productService } from '../service/productService';
import type {Product} from '../types';


export const useProductList = (autoFetch: boolean = true) => {
    const [all, setAll] = useState<Product[]>([]);
    const [byCategory, setByCategory] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [newProducts, setNewProducts] = useState<Product[]>([]);
    const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(autoFetch);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!autoFetch) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const [allProds, best, newProds, topRated] = await Promise.all([
                    productService.getAll(),
                    productService.getBestsale(),
                    productService.getNewProduct(),
                    productService.getRatingProduct()
                ]);
                setAll(allProds);
                setBestSellers(best);
                setNewProducts(newProds);
                setTopRatedProducts(topRated);
            } catch (err) {
                setError("Error fetching products");
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [autoFetch]);

    const fetchByCategory = async (categoryId: string) => {
        try {
            setLoading(true);
            const data = await productService.getBycategory(categoryId);
            setByCategory(data);
        } catch (err) {
            setError("Error fetching products by category");
            console.error("Error fetching products by category:", err);
        } finally {
            setLoading(false);
        }
    };

    return { all, byCategory, bestSellers, newProducts, topRatedProducts, loading, error, fetchByCategory };
};

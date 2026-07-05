import { useState, useEffect } from 'react';
import { productService } from '../service/productService';
import type { Product } from '../types';

const DEFAULT_LIMIT = 12;

export const useProductList = (autoFetch: boolean = true) => {
    const [all, setAll] = useState<Product[]>([]);
    const [byCategory, setByCategory] = useState<Product[]>([]);
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [newProducts, setNewProducts] = useState<Product[]>([]);
    const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(autoFetch);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    const fetchPage = async (page: number = 1, keyword?: string) => {
        try {
            setLoading(true);
            const data = await productService.getAll({ page, limit: DEFAULT_LIMIT, keyword });
            setAll(data.products);
            setCurrentPage(data.page);
            setTotalPages(data.pages);
            setTotalProducts(data.totalProducts);
        } catch (err) {
            setError("Error fetching products");
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!autoFetch) return;
        const fetchData = async () => {
            try {
                setLoading(true);
                const [paginatedData, best, newProds, topRated] = await Promise.all([
                    productService.getAll({ page: 1, limit: DEFAULT_LIMIT }),
                    productService.getBestsale(),
                    productService.getNewProduct(),
                    productService.getRatingProduct()
                ]);
                setAll(paginatedData.products);
                setCurrentPage(paginatedData.page);
                setTotalPages(paginatedData.pages);
                setTotalProducts(paginatedData.totalProducts);
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
            const data = await productService.getByLanguage(categoryId);
            setByCategory(data);
        } catch (err) {
            setError("Error fetching products by category");
            console.error("Error fetching products by category:", err);
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            fetchPage(page);
        }
    };

    return {
        all,
        byCategory,
        bestSellers,
        newProducts,
        topRatedProducts,
        loading,
        error,
        fetchByCategory,
        // Pagination
        currentPage,
        totalPages,
        totalProducts,
        goToPage,
        fetchPage,
    };
};

import { useState, useEffect } from 'react';
import { productService } from '../service/productService.tsx';
import type {Product, ProductParams, FilterState} from "../types";


function useProductSearch(filters: FilterState) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Nếu không có từ khóa tìm kiếm và không có bộ lọc nào khác, không gọi API
        // Trừ khi bạn muốn hiển thị tất cả sản phẩm khi không có filter
        if (!filters.search && (!filters.category || filters.category === 'all') && !filters.tech) {
            setProducts([]);
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: ProductParams = {};

                // Chỉ thêm vào params nếu giá trị có tồn tại (khác rỗng)
                if (filters.search) {
                    params.title_like = filters.search;
                }

                if (filters.category && filters.category !== 'all') {
                    params.categoryId = filters.category;
                }

                if (filters.tech) {
                    params.q = filters.tech;
                }
                const data = await productService.getAll(params);
                setProducts(data);

            } catch (error) {
                console.error("Failed to fetch products", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters.search, filters.category, filters.tech]);

    return { products, loading };
}

export default useProductSearch;
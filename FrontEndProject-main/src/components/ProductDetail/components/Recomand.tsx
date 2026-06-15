import React, { useEffect, useRef } from "react";
import { productService } from "../../../service/productService";
import ProductCarousel from "../../Products/components/ProductCarousel";
import type { Product } from "../../../types";
import { useState } from "react";

interface RecomandProps {
    platform: string;       // Dùng platform thay vì categoryId (MongoDB schema)
    currentProductId: string; // MongoDB _id là string
}

const Recomand: React.FC<RecomandProps> = ({ platform, currentProductId }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const revealRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!platform) return;
        setLoading(true);
        productService.getByPlatform(platform)
            .then((data) => setProducts(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [platform]);

    // Handle scroll reveal animation
    useEffect(() => {
        if (loading || !revealRef.current) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        observer.observe(revealRef.current);
        return () => observer.disconnect();
    }, [loading, products]);

    // Lọc bỏ sản phẩm hiện tại khỏi danh sách gợi ý
    const recommendedProducts = products.filter(
        (product) => product._id !== currentProductId
    );

    if (loading) {
        return <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải gợi ý...</div>;
    }

    if (recommendedProducts.length === 0) {
        return null;
    }

    return (
        <div ref={revealRef} className="reveal" style={{ marginTop: '40px' }}>
            <ProductCarousel
                titleStart="Có thể bạn cũng thích."
                titleHighlight="Sản phẩm tương tự."
                products={recommendedProducts}
            />
        </div>
    );
};

export default Recomand;

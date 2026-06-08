import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/ProductDetail/components/HeroSection";
import TechSpecs from "../../components/ProductDetail/components/TechSpecs";
import Reviews from "../../components/ProductDetail/components/Reviews";
import Recomand from "../../components/ProductDetail/components/Recomand";
import { useProductDetail } from "../../hook/useProductDetail";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const productId = id || '';
    const { product, loading, error } = useProductDetail(productId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [productId]);

    useEffect(() => {
        if (loading || !product) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const hiddenElements = document.querySelectorAll('.reveal');
        hiddenElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [product, loading]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen font-sans bg-white">
                <Header />
                <main className="flex-1 w-full flex justify-center items-center min-h-[60vh] pt-[60px]">
                    <p className="text-apple-gray text-lg">Đang tải...</p>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col min-h-screen font-sans bg-white">
                <Header />
                <main className="flex-1 w-full flex justify-center items-center min-h-[60vh] pt-[60px]">
                    <p className="text-apple-gray text-lg">{error ? "Có lỗi xảy ra" : "Sản phẩm không tồn tại"}</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen font-sans bg-white">
            <Header />

            <main className="flex-1 w-full pt-[60px]">
                <HeroSection product={product} />
                <TechSpecs product={product} />
                <Reviews productId={productId} />
                <Recomand platform={product.platform} currentProductId={product._id} />
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;

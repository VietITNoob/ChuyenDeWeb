import React from 'react';
import type { Product } from "../../../types";

interface TechSpecsProps {
    product: Product;
}

const TechSpecs: React.FC<TechSpecsProps> = ({ product }) => {

    const specsConfig = [
        { label: 'Công nghệ', value: product.tech },
        { label: 'UI Framework', value: product.UI_Framework },
        { label: 'Backend', value: product.BackEnd },
        { label: 'Database', value: product.database },
    ];

    return (
        <section className="bg-white py-20 reveal">
            <div className="max-w-[760px] mx-auto px-5">
                <h2 className="text-[36px] font-bold text-center mb-12 text-apple-dark">Thông số kỹ thuật</h2>
                <div className="border-t border-[#d2d2d7]">
                    {specsConfig.map((spec, index) => {
                        // Logic kiểm tra
                        if (!spec.value || (Array.isArray(spec.value) && spec.value.length === 0)) {
                            return null;
                        }

                        return (
                            <div className="flex justify-between py-5 border-b border-[#d2d2d7] text-[17px]" key={index}>
                                <span className="font-medium text-apple-gray">{spec.label}</span>
                                <strong className="font-semibold text-apple-dark">
                                    {Array.isArray(spec.value) ? spec.value.join(', ') : spec.value}
                                </strong>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TechSpecs;
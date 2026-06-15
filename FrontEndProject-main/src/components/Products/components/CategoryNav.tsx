import {useEffect, useState} from 'react';
import type {Category} from '../../../types';
import {categoryService} from "../../../service/categroryService.tsx";

interface CategoryNavProps {
  onSelectCategory: (categoryId: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Lỗi tải danh mục:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className="text-center py-10 text-apple-gray">Đang tải danh mục...</div>;
  return (
    <div className="flex justify-center gap-10 pt-[60px] pb-10 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-2xl mx-10 mb-10 overflow-x-auto scrollbar-hide">
      <div className="flex flex-col items-center gap-3 cursor-pointer transition-opacity duration-300 hover:opacity-80 group active:scale-95" onClick={() => onSelectCategory('')}>
          <div className="w-[60px] h-[60px] transition-transform duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:-translate-y-3 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] rounded-xl bg-white p-2 flex items-center justify-center">
            <img src="https://cdn-icons-png.flaticon.com/512/1005/1005141.png" alt="All" className="w-full h-full object-contain filter drop-shadow-sm" />
          </div>
          <span className="text-[12px] font-medium text-apple-dark relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-px after:bg-apple-dark after:transition-all after:duration-300 group-hover:after:w-full group-hover:after:left-0">All</span>
      </div>
      {categories.map((cat) => (
        <div key={cat.id} className="flex flex-col items-center gap-3 cursor-pointer transition-opacity duration-300 hover:opacity-80 group active:scale-95" onClick={() => onSelectCategory(String(cat.id))}>
          <div className="w-[60px] h-[60px] transition-transform duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:-translate-y-3 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)] rounded-xl bg-white p-2 flex items-center justify-center">
            <img src={cat.image} alt={cat.name} className="w-full h-full object-contain filter drop-shadow-sm" />
          </div>
          <span className="text-[12px] font-medium text-apple-dark relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-px after:bg-apple-dark after:transition-all after:duration-300 group-hover:after:w-full group-hover:after:left-0">{cat.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryNav;
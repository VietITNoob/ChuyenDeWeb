import type {Category} from '../types'
import axiosClient from "../api/axiosClient.tsx";

export const categoryService= {
    getAll: (): Promise<Category[]> => {
        return axiosClient.get('/categories');
    }
};


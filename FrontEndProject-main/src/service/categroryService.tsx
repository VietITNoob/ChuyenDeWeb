import type {Category} from '../types'


export const categoryService= {
    getAll: (): Promise<Category[]> => {
        return Promise.resolve([
            {
                id: 'Web',
                name: 'Web Apps',
                image: 'https://cdn-icons-png.flaticon.com/512/3214/3214746.png'
            },
            {
                id: 'Mobile',
                name: 'Mobile',
                image: 'https://cdn-icons-png.flaticon.com/512/3356/3356133.png'
            },
            {
                id: 'UI Kit',
                name: 'UI Kits',
                image: 'https://cdn-icons-png.flaticon.com/512/2874/2874136.png'
            },
            {
                id: 'Python',
                name: 'Python',
                image: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png'
            },
            {
                id: 'JavaScript',
                name: 'JavaScript',
                image: 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png'
            }
        ]);
    }
};



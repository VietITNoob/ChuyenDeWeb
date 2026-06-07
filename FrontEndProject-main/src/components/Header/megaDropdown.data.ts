export interface MegaDropdownColumn {
  title: string;
  items: {
    label: string;
    href: string;
  }[];
}

export const MEGA_DROPDOWN_CONFIG: MegaDropdownColumn[] = [
  {
    title: 'KHÁM PHÁ',
    items: [
      { label: 'Tất cả Source Code', href: '/products' },
      { label: 'Bán chạy nhất', href: '/products/best-seller' },
      { label: 'Mới phát hành', href: '/products/new' },
    ],
  },
  {
    title: 'DANH MỤC HOT',
    items: [
      { label: 'React Native Apps', href: '/category/react-native' },
      { label: 'Flutter Apps', href: '/category/flutter' },
      { label: 'React Admin Dashboards', href: '/category/admin' },
    ],
  },
  {
    title: 'DÀNH CHO DEV',
    items: [
      { label: 'Tài liệu API', href: '/docs/api' },
      { label: 'Community Forum', href: '/community' },
    ],
  },
];

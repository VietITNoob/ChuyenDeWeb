import type { NavMenuItem } from "../../types/navigation";

export const HEADER_MENU: NavMenuItem[] = [
  { id: 'products', label: 'Sản phẩm', hasDropdown: true },
  { id: 'templates', label: 'Web Templates',path:'/webs' },
  { id: 'mobiles', label: 'Mobile Apps', path: '/mobiles' },
  { id: 'ui-kits', label: 'UI Kits',path:'/uis' },
];
export const HEADER_MENU_SEARCH: NavMenuItem[] = [
  { id: 'templates', label: 'Web Templates', path: '/webs' },
  { id: 'mobiles', label: 'Mobile Apps', path: '/mobiles' },
  { id: 'ui-kits', label: 'UI Kits', path: '/uis' },
];

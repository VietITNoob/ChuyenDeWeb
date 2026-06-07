import type { FooterColumn } from "../../types/footer";

export const FOOTER_NOTES = [
  '1. Giá trị Source Code chưa bao gồm VAT (nếu có). Vui lòng tham khảo chính sách thuế.',
  '2. Cam kết hoàn tiền trong 7 ngày nếu mã nguồn lỗi kỹ thuật không thể khắc phục.',
  '* Một số hình ảnh demo sử dụng tài nguyên miễn phí từ Unsplash.',
];

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    sections: [
      {
        title: 'Khám phá & Mua sắm',
        links: [
          { label: 'Source Code Web', href: '/products/web' },
          { label: 'Mobile Apps', href: '/products/mobile' },
          { label: 'UI Kits', href: '/products/ui-kits' },
          { label: 'Plugins', href: '/products/plugins' },
          { label: 'Hàng mới về', href: '/products/new' },
          { label: 'Flash Sale', href: '/sale' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tài khoản',
        links: [
          { label: 'Quản lý đơn hàng', href: '/account/orders' },
          { label: 'Tải xuống', href: '/account/downloads' },
          { label: 'Yêu thích', href: '/account/wishlist' },
          { label: 'Cài đặt tài khoản', href: '/account/settings' },
        ],
      },
      {
        title: 'Dành cho Partner',
        links: [
          { label: 'Đăng bán Source Code', href: '/partner/sell' },
          { label: 'Chính sách hoa hồng', href: '/partner/commission' },
          { label: 'Cổng thông tin', href: '/partner/portal' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'CodeStore Wallet',
        links: [
          { label: 'Ví điện tử', href: '/wallet' },
          { label: 'Nạp tiền', href: '/wallet/topup' },
          { label: 'Lịch sử giao dịch', href: '/wallet/history' },
        ],
      },
      {
        title: 'Hỗ trợ Kỹ thuật',
        links: [
          { label: 'Hướng dẫn cài đặt', href: '/support/install' },
          { label: 'Community Forum', href: '/community' },
          { label: 'Ticket Support', href: '/support/ticket' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Về CodeStore',
        links: [
          { label: 'Câu chuyện thương hiệu', href: '/about' },
          { label: 'Tuyển dụng', href: '/careers' },
          { label: 'Tin tức', href: '/news' },
          { label: 'Liên hệ', href: '/contact' },
        ],
      },
      {
        title: 'Khách hàng Doanh nghiệp',
        links: [
          { label: 'CodeStore for Business', href: '/business' },
          { label: 'Mua giấy phép sỉ', href: '/business/license' },
        ],
      },
    ],
  },
];

export const FOOTER_LEGAL_LINKS = [
  { label: 'Chính sách quyền riêng tư', href: '/privacy' },
  { label: 'Điều khoản sử dụng', href: '/terms' },
  { label: 'Bán hàng và Hoàn tiền', href: '/refund' },
  { label: 'Pháp lý', href: '/legal' },
  { label: 'Sơ đồ trang', href: '/sitemap' },
];

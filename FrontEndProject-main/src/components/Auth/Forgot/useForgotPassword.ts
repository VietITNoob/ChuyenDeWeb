import { useState } from 'react';

// Định nghĩa kiểu dữ liệu trả về của Hook để gợi ý code tốt hơn
interface UseForgotPasswordReturn {
  email: string;
  setEmail: (value: string) => void;
  loading: boolean;
  isSubmitted: boolean;
  error: string | null;
  isValidEmail: boolean;
  setIsSubmitted: (value: boolean) => void;
  handleResetPassword: (e: React.FormEvent) => Promise<void>;
  handleRetry: () => void;
}

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Logic Validate Email đơn giản
  const isValidEmail = email.includes('@') && email.length > 5;

  // Hàm xử lý khi bấm nút Gửi
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail) return;

    setLoading(true);
    setError(null); // Reset lỗi cũ

    try {
      // Gọi API đến Server Custom (Port 3001 như bạn đã cấu hình)
      const response = await fetch('http://localhost:3001/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Thành công -> Chuyển sang màn hình thông báo
        setIsSubmitted(true);
      } else {
        // Thất bại -> Hiển thị lỗi từ server trả về
        setError(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Error sending reset email:', err);
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm để quay lại form nhập nếu muốn gửi lại
  const handleRetry = () => {
    setIsSubmitted(false);
    setEmail('');
    setError(null);
  };

  return {
    email,
    setEmail,
    loading,
    isSubmitted,
    error,
    isValidEmail,
    setIsSubmitted,
    handleResetPassword,
    handleRetry
  };
};
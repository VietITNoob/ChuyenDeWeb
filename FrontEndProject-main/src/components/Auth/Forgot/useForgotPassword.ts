import { useState } from 'react';
import { authService } from '../../../service/authService';

// Định nghĩa kiểu dữ liệu trả về của Hook
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

  // Validate Email
  const isValidEmail = email.includes('@') && email.length > 5;

  // Hàm xử lý khi bấm nút Gửi
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setLoading(true);
    setError(null);

    try {
      // Gọi API backend Express.js → POST /api/auth/forgot-password
      await authService.forgotPassword(email);
      // Backend luôn trả 200 để tránh lộ email (dù email không tồn tại)
      setIsSubmitted(true);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm quay lại form nhập email
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
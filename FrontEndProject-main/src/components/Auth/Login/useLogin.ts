import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Dùng login() từ AuthContext → gọi POST /api/auth/login

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // States
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  // Effect: Auto focus
  useEffect(() => {
    if (step === 'email' && inputRef.current) inputRef.current.focus();
    if (step === 'password' && passwordRef.current) passwordRef.current.focus();
  }, [step]);

  // Hàm rung lắc
  const triggerShake = () => {
    setErrorShake(true);
    setTimeout(() => setErrorShake(false), 400);
  };

  // LOGIC XỬ LÝ CHÍNH
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // --- BƯỚC 1: EMAIL ---
    if (step === 'email') {
      if (!email) {
        triggerShake();
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep('password');
      }, 500);
    }

    // --- BƯỚC 2: PASSWORD & GỌI API BACKEND ---
    else {
      if (!password) {
        triggerShake();
        return;
      }

      setLoading(true);
      try {
        // Gọi AuthContext.login() → authService.login() → POST /api/auth/login
        // Sẽ tự lưu token và user vào localStorage
        await login(email, password);

        // Chuyển trang về trang chủ
        navigate('/');

      } catch (error: any) {
        console.error("Login Error:", error);
        triggerShake();
        alert(error.message || 'Đăng nhập thất bại! Kiểm tra lại email/mật khẩu.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Logic phụ
  const handleEditEmail = () => {
    setStep('email');
    setPassword('');
  };

  const isEmailValid = email.length > 0;
  const isPasswordValid = password.length > 0;

  return {
    step,
    email, setEmail,
    password, setPassword,
    isFocused, setIsFocused,
    loading,
    errorShake,
    isEmailValid,
    isPasswordValid,
    inputRef,
    passwordRef,
    handleSubmit,
    handleEditEmail,
    triggerShake
  };
};
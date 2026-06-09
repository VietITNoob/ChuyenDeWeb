import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// Định nghĩa kiểu dữ liệu cho Form
export interface RegisterFormData {
    firstName: string;
    lastName: string;
    country: string;
    birthday: {
        month: string | number;
        day: string | number;
        year: string | number;
    };
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    captcha: string;
    verifyMethod: string;
}

export const useRegister = () => {
    const navigate = useNavigate();
    const { register } = useAuth(); // Dùng register() từ AuthContext → gọi POST /api/auth/register
    const [loading, setLoading] = useState(false);

    // Khởi tạo state
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        country: 'Vietnam',
        birthday: { month: '', day: '', year: '' },
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        captcha: '',
        verifyMethod: 'sms'
    });

    // Xử lý thay đổi input thường
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý thay đổi ngày sinh
    const handleBirthdayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            birthday: { ...prev.birthday, [name]: value }
        }));
    };

    // Xử lý Submit Form
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validation cơ bản
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        if (formData.captcha.toUpperCase() !== 'XK49') {
            alert("Mã xác thực không đúng! (Gợi ý: XK49)");
            return;
        }

        setLoading(true);

        try {
            // 2. Gọi AuthContext.register() → authService.register() → POST /api/auth/register
            // Backend nhận { name, email, password, role }
            // Gộp firstName + lastName thành name
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            await register(fullName, formData.email, formData.password, 'buyer');

            alert("Đăng ký tài khoản thành công!");
            navigate('/');

        } catch (error: any) {
            console.error("Register Error:", error);
            alert(error.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        handleChange,
        handleBirthdayChange,
        handleRegister
    };
};
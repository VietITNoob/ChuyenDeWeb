import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../service/authService';
import type { AuthResponse } from '../types';

// =============================================
// 1. Định nghĩa kiểu dữ liệu User (khớp MongoDB)
// =============================================
export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    avatar?: string;
}

// =============================================
// 2. Định nghĩa Context Type
// =============================================
interface AuthContextType {
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (credential: string) => Promise<void>;
    register: (name: string, email: string, password: string, role?: 'buyer' | 'seller') => Promise<void>;
    loginWithData: (userData: AuthUser, token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================
// 3. Provider Component
// =============================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Khôi phục session từ localStorage khi App khởi động
    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');

            if (storedUser && token) {
                try {
                    const parsedUser = JSON.parse(storedUser) as AuthUser;
                    setUser(parsedUser);
                } catch (e) {
                    console.error('Lỗi parse user từ localStorage', e);
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // Hàm nội bộ: lưu user và token sau khi auth thành công
    const saveAuthData = (data: AuthResponse & { avatar?: string }) => {
        const authUser: AuthUser = {
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role,
            avatar: data.avatar,
        };
        setUser(authUser);
        setError(null);
        localStorage.setItem('user', JSON.stringify(authUser));
        localStorage.setItem('accessToken', data.token);
    };

    // ===== Đăng nhập qua backend =====
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.login({ email, password });
            saveAuthData(data);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    // ===== Đăng ký qua backend =====
    const register = async (name: string, email: string, password: string, role?: 'buyer' | 'seller') => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.register({ name, email, password, role });
            saveAuthData(data);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    // ===== Đăng nhập bằng Google OAuth =====
    const loginWithGoogle = async (credential: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.googleLogin(credential);
            saveAuthData(data as any);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
            setError(message);
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    // ===== Login thủ công (dùng khi đã có data từ nơi khác) =====
    const loginWithData = (userData: AuthUser, token: string) => {
        setUser(userData);
        setError(null);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', token);
    };

    // ===== Đăng xuất =====
    const logout = () => {
        setUser(null);
        setError(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            loginWithGoogle,
            register,
            loginWithData,
            logout,
            isAuthenticated: !!user,
            isLoading,
            error
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// =============================================
// 4. Hook sử dụng Context
// =============================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Export type User để tương thích với code cũ dùng `User` từ AuthContext
export type { AuthUser as User };
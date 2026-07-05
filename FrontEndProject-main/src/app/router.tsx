
import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../components/Auth/Login/LoginPage';
import RegisterPage from '../components/Auth/Register/RegisterPage';
import ProductDetail from "../pages/productDetail/ProductDetail.tsx";
import ProductsPage from "../components/Products/ProductsPage.tsx";
import CartPage from '../pages/Cart/CartPage';
import WishlistPage from '../pages/Wishlist/WishlistPage';
import UserProfilePage from '../components/Profile/UserProfilePage.tsx';
import OrderDetailsPage from '../pages/Order/OrderDetailsPage.tsx';
import MobilePage from '../pages/Mobile/MobilePage.tsx';
import WebPage from '../pages/Web/WebPage.tsx';
import UIPage from '../pages/UI/UIPage.tsx';
import ForgotPasswordPage from '../components/Auth/Forgot/ForgotPage.tsx';
import ResetPasswordPage from '../components/Auth/ResetPassword/ResetPasswordPage.tsx';
import VNPayReturnPage from '../pages/Payment/VNPayReturnPage.tsx';
import AdminPage from '../pages/Admin/AdminPage.tsx';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: '/forgot',
    element: <ForgotPasswordPage />
  },
  {
    path: '/reset-password/:token',
    element: <ResetPasswordPage />
  },
  {
    path: "/products",      // <--- 2. Đường dẫn mới
    element: <ProductsPage />,
  },
  {
    path: '/cart',
    element: <CartPage />,

  },
  {
    path: '/wishlist',
    element: <WishlistPage />
  },
  {
    path: "/product/:id",
    element: <ProductDetail />
  }
  ,
  {
    path: "/account/home",
    element: <UserProfilePage />
  },
  {
    path: '/orders/:id',
    element: <OrderDetailsPage />
  },
  {
    path: '/mobiles',
    element: <MobilePage />
  },
  {
    path: '/webs',
    element: <WebPage />
  },
  {
    path: '/uis',
    element: <UIPage />
  },
  {
    path: '/payment/vnpay_return',
    element: <VNPayReturnPage />
  },
  {
    path: '/admin',
    element: <AdminPage />
  },


]);

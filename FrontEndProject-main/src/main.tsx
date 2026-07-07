import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'

import './index.css'
import { AuthProvider } from './context/AuthContext.tsx' 
import { CartProvider } from './context/CartContext.tsx' 
import { WishlistProvider } from './context/WishlistContext.tsx'
import { ToastProvider } from './context/ToastContext.tsx'
import App from './app/App.tsx'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
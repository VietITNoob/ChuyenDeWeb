import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import { AuthProvider } from './context/AuthContext.tsx' 
import { CartProvider } from './context/CartContext.tsx' 
import { WishlistProvider } from './context/WishlistContext.tsx'
import App from './app/App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. Bọc AuthProvider ra ngoài cùng (hoặc bên trong CartProvider đều được) */}
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
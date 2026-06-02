import React, { createContext, useContext, useState, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[3000] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-xl px-5 py-4 text-[14px] font-semibold shadow-[0_10px_30px_rgba(0,0,0,0.12)] border flex items-center gap-3 min-w-[300px] max-w-[400px] pointer-events-auto transition-all duration-300 transform translate-y-0 bg-white border-black/5 ${
              toast.type === 'success'
                ? 'text-[#1e8e3e] border-l-4 border-l-[#1e8e3e]'
                : toast.type === 'error'
                ? 'text-[#d70015] border-l-4 border-l-[#d70015]'
                : 'text-[#0071e3] border-l-4 border-l-[#0071e3]'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              toast.type === 'success' ? 'bg-[#1e8e3e]' : toast.type === 'error' ? 'bg-[#d70015]' : 'bg-[#0071e3]'
            }`} />
            <div className="flex-1 leading-snug">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

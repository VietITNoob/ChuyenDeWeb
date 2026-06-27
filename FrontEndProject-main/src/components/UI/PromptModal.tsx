import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  label: string;
  placeholder?: string;
  submitText?: string;
  cancelText?: string;
  defaultValue?: string;
}

export const PromptModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  label,
  placeholder = 'Nhập thông tin...',
  submitText = 'Xác nhận',
  cancelText = 'Hủy',
  defaultValue = '',
}: PromptModalProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-black/5 flex flex-col overflow-hidden transform scale-100 transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <h3 className="text-[17px] font-bold text-[#1d1d1f]">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-apple-gray hover:text-apple-dark bg-transparent border-none p-1 rounded-full hover:bg-[#f5f5f7] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Content */}
          <div className="px-6 pb-6 flex flex-col gap-2">
            <label className="text-[13px] font-medium text-[#424245]">{label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-[#d2d2d7] bg-white text-[14px] outline-none transition-all focus:border-apple-blue focus:ring-1 focus:ring-apple-blue/20"
            />
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#f5f5f7] border-t border-[#e5e5ea] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[14px] font-semibold text-[#1d1d1f] bg-white border border-[#d2d2d7] hover:bg-[#f5f5f7] active:scale-95 transition-all cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-[14px] font-semibold text-white bg-apple-blue hover:bg-[#0077ed] shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

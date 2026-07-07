import { X, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isDanger = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-black/5 flex flex-col overflow-hidden transform scale-100 transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            {isDanger && <AlertCircle className="text-[#d70015]" size={20} />}
            <h3 className="text-[17px] font-bold text-[#1d1d1f]">{title}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-apple-gray hover:text-apple-dark bg-transparent border-none p-1 rounded-full hover:bg-[#f5f5f7] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-[14px] leading-relaxed text-[#424245]">
          {message}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f5f5f7] border-t border-[#e5e5ea] flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[14px] font-semibold text-[#1d1d1f] bg-white border border-[#d2d2d7] hover:bg-[#f5f5f7] active:scale-95 transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-[14px] font-semibold text-white shadow-sm active:scale-95 transition-all cursor-pointer ${
              isDanger 
                ? 'bg-[#d70015] hover:bg-[#b80012]' 
                : 'bg-apple-blue hover:bg-[#0077ed]'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

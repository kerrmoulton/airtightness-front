import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border ${bgColor} ${textColor} ${borderColor} shadow-lg animate-slide-up`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
'use client';

  import React, { useEffect } from 'react';
  import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

  export interface ToastProps {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose: (id: string) => void;
  }

  export default function Toast({ 
    id, 
    message, 
    type = 'info', 
    duration = 3000, 
    onClose 
  }: ToastProps) {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const icons = {
      success: <CheckCircle className="w-5 h-5" />,
      error: <XCircle className="w-5 h-5" />,
      warning: <AlertCircle className="w-5 h-5" />,
      info: <Info className="w-5 h-5" />,
    };

    const styles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    return (
      <div className={`flex items-center p-4 mb-3 border rounded-lg shadow-lg ${styles[type]}`}>
        <div className="mr-3">
          {icons[type]}
        </div>
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        <button
          onClick={() => onClose(id)}
          className="ml-3 p-1 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }
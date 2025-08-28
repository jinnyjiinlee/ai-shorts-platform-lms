'use client';

import { useState, useCallback } from 'react';
import ToastContainer, { ToastData } from './ToastContainer';

export default function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 3000) => {
      const id = Date.now().toString();
      const newToast: ToastData = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastWrapper = () => <ToastContainer toasts={toasts} onClose={removeToast} />;

  return {
    addToast,
    removeToast,
    ToastContainer: ToastWrapper,
  };
}

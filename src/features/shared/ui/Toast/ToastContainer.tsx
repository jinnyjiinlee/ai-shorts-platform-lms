'use client';

  import React from 'react';
  import Toast from './Toast';

  export interface ToastData {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }

  interface ToastContainerProps {
    toasts: ToastData[];
    onClose: (id: string) => void;
  }

  export default function ToastContainer({ toasts, onClose }: ToastContainerProps) {
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={onClose}
          />
        ))}
      </div>
    );
  }
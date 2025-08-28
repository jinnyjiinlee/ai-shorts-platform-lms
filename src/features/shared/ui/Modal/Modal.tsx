'use client';

import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showHeader?: boolean;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

export default function Modal({ 
  show, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showHeader = true,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  headerClassName = '',
  bodyClassName = ''
}: ModalProps) {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  // ESC 키 처리
  useEffect(() => {
    if (!show || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [show, closeOnEscape, onClose]);

  if (!show) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '4xl': 'max-w-7xl',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />
      <div 
        className={`relative bg-white rounded-xl shadow-xl max-h-[90vh] overflow-hidden w-full mx-4 ${sizeStyles[size]} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {showHeader && (title || showCloseButton) && (
          <div className={`flex items-center justify-between p-6 border-b border-slate-200 ${headerClassName}`}>
            {title && (
              <h2 id="modal-title" className="text-xl font-semibold text-slate-800">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="모달 닫기"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            )}
          </div>
        )}
        <div className={`p-6 overflow-y-auto ${showHeader ? 'max-h-[calc(90vh-120px)]' : 'max-h-[90vh]'} ${bodyClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
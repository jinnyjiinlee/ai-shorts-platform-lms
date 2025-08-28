'use client';

import React from 'react';
import Modal, { ModalProps } from './Modal';
import { Button } from '@/features/shared/ui/Button';

export interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmModal({
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  variant = 'info',
  isLoading = false,
  ...modalProps
}: ConfirmModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmVariant: 'danger' as const,
          icon: '⚠️',
          titleColor: 'text-red-800'
        };
      case 'warning':
        return {
          confirmVariant: 'secondary' as const,
          icon: '🚨',
          titleColor: 'text-orange-800'
        };
      default:
        return {
          confirmVariant: 'primary' as const,
          icon: 'ℹ️',
          titleColor: 'text-blue-800'
        };
    }
  };

  const { confirmVariant, icon, titleColor } = getVariantStyles();

  return (
    <Modal {...modalProps} size="sm">
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <p className="text-gray-700 mb-6 text-base leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            variant="ghost"
            onClick={modalProps.onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
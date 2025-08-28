'use client';

import React, { ReactNode } from 'react';
import Modal, { ModalProps } from './Modal';
import { Button } from '@/features/shared/ui/Button';

export interface FormModalProps extends Omit<ModalProps, 'children'> {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitText?: string;
  cancelText?: string;
  submitDisabled?: boolean;
  isLoading?: boolean;
  showCancelButton?: boolean;
  submitVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
}

export default function FormModal({
  children,
  onSubmit,
  submitText = '저장',
  cancelText = '취소',
  submitDisabled = false,
  isLoading = false,
  showCancelButton = true,
  submitVariant = 'primary',
  ...modalProps
}: FormModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal {...modalProps}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {children}
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          {showCancelButton && (
            <Button
              type="button"
              variant="ghost"
              onClick={modalProps.onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            type="submit"
            variant={submitVariant}
            disabled={submitDisabled}
            isLoading={isLoading}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
import { useState, useCallback } from 'react';

export interface UseModalOptions<T = any> {
  defaultData?: T;
  onOpen?: (data?: T) => void;
  onClose?: () => void;
}

export interface UseModalReturn<T = any> {
  isOpen: boolean;
  data: T | null;
  open: (modalData?: T) => void;
  close: () => void;
  setData: (data: T | null) => void;
  toggle: () => void;
}

/**
 * 모달 상태 관리를 위한 통합 훅
 * 
 * @example
 * ```tsx
 * const modal = useModal<User>();
 * 
 * // 모달 열기
 * modal.open(userData);
 * 
 * // 모달에서 사용
 * <Modal show={modal.isOpen} onClose={modal.close}>
 *   {modal.data && <div>{modal.data.name}</div>}
 * </Modal>
 * ```
 */
export const useModal = <T = any>(options?: UseModalOptions<T>): UseModalReturn<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(options?.defaultData || null);
  
  const open = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
    options?.onOpen?.(modalData);
  }, [options]);
  
  const close = useCallback(() => {
    setIsOpen(false);
    options?.onClose?.();
  }, [options]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  return { 
    isOpen, 
    data, 
    open, 
    close, 
    setData,
    toggle
  };
};

/**
 * 확인 모달을 위한 특화 훅
 */
export interface UseConfirmModalOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const useConfirmModal = (options?: UseConfirmModalOptions) => {
  const modal = useModal<UseConfirmModalOptions>();
  
  const confirm = useCallback(async (
    action: () => Promise<void> | void,
    customOptions?: Partial<UseConfirmModalOptions>
  ) => {
    return new Promise<boolean>((resolve) => {
      const finalOptions = { ...options, ...customOptions };
      
      modal.open({
        ...finalOptions,
        onConfirm: async () => {
          try {
            await action();
            modal.close();
            resolve(true);
          } catch (error) {
            console.error('Confirm action failed:', error);
            resolve(false);
          }
        },
        onCancel: () => {
          modal.close();
          resolve(false);
        }
      } as any);
    });
  }, [modal, options]);

  return {
    ...modal,
    confirm
  };
};
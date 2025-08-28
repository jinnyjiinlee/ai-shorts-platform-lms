import { useState, useCallback } from 'react';

export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [form, setForm] = useState<T>(initialState);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const updateForm = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    if (typeof updates === 'function') {
      setForm(updates);
    } else {
      setForm(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const resetForm = useCallback(() => {
    setForm(initialState);
    setIsEditing(false);
    setEditingItem(null);
  }, [initialState]);

  const startEdit = useCallback((item: any) => {
    setEditingItem(item);
    setIsEditing(true);
    setForm({ ...initialState, ...item });
  }, [initialState]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditingItem(null);
    setForm(initialState);
  }, [initialState]);

  const handleInputChange = useCallback((field: keyof T) => (
    value: T[keyof T] | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const actualValue = typeof value === 'object' && 'target' in value 
      ? value.target.value 
      : value;
    
    updateForm({ [field]: actualValue } as Partial<T>);
  }, [updateForm]);

  return {
    form,
    isEditing,
    editingItem,
    updateForm,
    resetForm,
    startEdit,
    cancelEdit,
    handleInputChange,
  };
}
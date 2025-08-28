import { useState } from 'react';

export function useModal<T = any>() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [viewItem, setViewItem] = useState<T | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const openModal = (item?: T) => {
    if (item) {
      setSelectedItem(item);
      setIsEditing(true);
    } else {
      setSelectedItem(null);
      setIsEditing(false);
    }
    setIsOpen(true);
  };

  const openView = (item: T) => {
    setViewItem(item);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
  };

  const closeView = () => {
    setViewItem(null);
  };

  return {
    isOpen,
    selectedItem,
    viewItem,
    isEditing,
    openModal,
    openView,
    closeModal,
    closeView,
  };
}
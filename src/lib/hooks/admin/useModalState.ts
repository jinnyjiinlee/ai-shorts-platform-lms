import { useState } from 'react';
import { Mission } from '../../types';

export const useModalState = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'submission'>('create');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    cohort: 1,
    week: 1
  });

  const resetFormData = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      cohort: 1,
      week: 1
    });
  };

  const setFormDataFromMission = (mission: Mission) => {
    // UTC 시간을 로컬 시간으로 변환하여 datetime-local 입력에 설정
    let localDueDate = mission.due_date;
    if (mission.due_date) {
      const utcDate = new Date(mission.due_date);
      // 로컬 시간대로 변환하고 datetime-local 형식으로 포맷
      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
      localDueDate = localDate.toISOString().slice(0, 16);
    }

    setFormData({
      title: mission.title,
      description: mission.description,
      due_date: localDueDate,
      cohort: mission.cohort,
      week: mission.week
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    setShowModal,
    selectedMission,
    setSelectedMission,
    modalType,
    setModalType,
    formData,
    setFormData,
    resetFormData,
    setFormDataFromMission,
    closeModal
  };
};
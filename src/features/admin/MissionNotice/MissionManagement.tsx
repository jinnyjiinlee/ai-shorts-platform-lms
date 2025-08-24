'use client';

import { useState } from 'react';

// 컴포넌트 임포트
import MissionHeader from '../../missions/admin/lists/MissionHeader';
import MissionTable from '../../missions/admin/lists/MissionTable';
import MissionFormModal from '../../missions/admin/modals/MissionFormModal';
import SubmissionListModal from '../../missions/admin/modals/SubmissionListModal';

// 훅 및 유틸리티 임포트
import { useMissionManagement } from '@/lib/hooks/admin/useMissionManagement';
import { useModalState } from '@/lib/hooks/admin/useModalState';
import { getFilteredMissions, getAvailableCohorts } from '@/lib/utils/missionUtils';
import { Mission } from '../../missions/admin/types';

export default function MissionManagement() {
  const { missions, isLoading, saveMission, removeMission, refreshMissions } = useMissionManagement();
  const {
    showModal,
    selectedMission,
    modalType,
    formData,
    setFormData,
    resetFormData,
    setFormDataFromMission,
    closeModal,
    setShowModal,
    setSelectedMission,
    setModalType,
  } = useModalState();

  const [selectedCohort, setSelectedCohort] = useState<number | 'all'>(1);

  const filteredMissions = getFilteredMissions(missions, selectedCohort);
  const availableCohorts = getAvailableCohorts(missions);

  const handleCreateMission = () => {
    setModalType('create');
    resetFormData();
    setShowModal(true);
  };

  const handleEditMission = (mission: Mission) => {
    setModalType('edit');
    setSelectedMission(mission);
    setFormDataFromMission(mission);
    setShowModal(true);
  };

  const handleViewSubmissions = (mission: Mission) => {
    setModalType('submission');
    setSelectedMission(mission);
    setShowModal(true);
  };

  const handleSaveMission = async () => {
    if (modalType === 'create' || modalType === 'edit') {
      await saveMission(modalType, formData, selectedMission || undefined);
    }
    closeModal();
  };

  return (
    <div className='space-y-6'>
      <MissionHeader
        selectedCohort={selectedCohort}
        availableCohorts={availableCohorts}
        onCohortChange={setSelectedCohort}
        onCreateMission={handleCreateMission}
        onRefresh={refreshMissions}
        isLoading={isLoading}
      />

      <MissionTable
        missions={filteredMissions}
        isLoading={isLoading}
        onViewSubmissions={handleViewSubmissions}
        onEditMission={handleEditMission}
        onDeleteMission={removeMission}
      />

      {(modalType === 'create' || modalType === 'edit') && (
        <MissionFormModal
          show={showModal}
          type={modalType}
          formData={formData}
          onClose={closeModal}
          onSave={handleSaveMission}
          onFormDataChange={setFormData}
        />
      )}

      {modalType === 'submission' && (
        <SubmissionListModal show={showModal} mission={selectedMission} onClose={closeModal} />
      )}
    </div>
  );
}

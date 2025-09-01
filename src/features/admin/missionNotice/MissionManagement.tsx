'use client';

import { useState } from 'react';

// 컴포넌트 임포트
import MissionHeader from './lists/MissionHeader';
import MissionBoard from './components/MissionBoard';
import { Modal } from '@/features/shared/ui/Modal';
import { InputField } from '@/features/shared/ui/InputField';
import { Button } from '@/features/shared/ui/Button';
import MarkdownEditor from '@/features/shared/ui/MarkdownEditor';
import SubmissionListModal from './modals/SubmissionListModal';

// 훅 및 유틸리티 임포트
import { useMissionManagement } from './hooks/useMissionManagement';
import { useModalState } from './hooks/useModalState';
import { getFilteredMissions, getAvailableCohorts } from '@/lib/utils/missionUtils';
import { Mission } from '@/types/domains/mission';

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

  const [selectedCohort, setSelectedCohort] = useState<string | 'all'>('1');

  const filteredMissions = getFilteredMissions(missions, selectedCohort);
  const availableCohorts = getAvailableCohorts(missions);

  const handleCreateMission = () => {
    setModalType('create');
    resetFormData(selectedCohort === 'all' ? '1' : selectedCohort);
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

      <MissionBoard
        missions={filteredMissions}
        userRole="admin"
        loading={isLoading}
        onViewMission={handleViewSubmissions}
        onEditMission={handleEditMission}
        onDeleteMission={removeMission}
      />

      {(modalType === 'create' || modalType === 'edit') && (
        <Modal
          show={showModal}
          title={modalType === 'create' ? '새 미션 추가' : '미션 수정'}
          onClose={closeModal}
          size='4xl'
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveMission();
            }}
          >
            <div className='space-y-6'>
              <InputField
                label='미션 제목'
                value={formData.title}
                onChange={(value: string) => setFormData({ ...formData, title: value })}
                placeholder='미션 제목을 입력하세요'
                required
              />

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>미션 설명</label>
                <MarkdownEditor
                  value={formData.description}
                  onChange={(value: string) => setFormData({ ...formData, description: value })}
                  placeholder='마크다운으로 미션에 대한 자세한 설명을 입력하세요'
                  className='min-h-[200px]'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <InputField
                  label='주차'
                  type='number'
                  value={formData.week?.toString() || ''}
                  onChange={(value: string) => setFormData({ ...formData, week: parseInt(value) || 0 })}
                  placeholder='1'
                />

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>마감일 및 시간</label>
                  <input
                    type='datetime-local'
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    min={new Date().toISOString().slice(0, 16)}
                    className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                  <p className='text-xs text-slate-500 mt-1'>오늘 날짜 이후로만 설정할 수 있습니다</p>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>대상 기수</label>
                <div className='w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium'>
                  {formData.cohort}기 (현재 선택된 기수)
                </div>
                <p className='text-xs text-slate-500 mt-1'>화면 상단에서 선택한 기수로 자동 설정됩니다</p>
              </div>
            </div>

            <div className='flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200'>
              <Button type='button' onClick={closeModal} variant='outline'>
                취소
              </Button>
              <Button type='submit' variant='primary'>
                {modalType === 'create' ? '미션 추가' : '수정 완료'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {modalType === 'submission' && (
        <SubmissionListModal show={showModal} mission={selectedMission} onClose={closeModal} />
      )}
    </div>
  );
}

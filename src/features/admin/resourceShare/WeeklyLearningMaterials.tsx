'use client';

import { useState } from 'react';
import { PlusIcon, FolderOpenIcon } from '@heroicons/react/24/outline';
import AdminPageHeader from '@/features/admin/ui/AdminPageHeader';
import MaterialCard from './MaterialCard';
import MaterialModal from './MaterialModal';
import { Select } from '@/features/shared/ui/Select';
import { useModal } from '@/features/shared/hooks/useModal';
import { useFormState } from '@/features/shared/hooks/useFormState';
import { useAsyncSubmit } from '@/features/shared/hooks/useAsyncSubmit';
import { LearningMaterial } from '@/types/domains/resource';

interface WeeklyLearningMaterialsProps {
  userRole: 'admin' | 'student';
}

export default function WeeklyLearningMaterials({ userRole }: WeeklyLearningMaterialsProps) {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');

  const modal = useModal<LearningMaterial>();
  const { form: formData, updateForm: setFormData, resetForm } = useFormState({
    title: '',
    description: '',
    week: 1,
    cohort: '1',
    fileName: '',
    fileSize: '',
    fileType: '',
    isPublished: true,
  });

  const availableWeeks = Array.from({ length: 16 }, (_, i) => i + 1); // 1주차부터 16주차까지

  // 필터링된 자료 목록 (1기 전용)
  const getFilteredMaterials = () => {
    let filtered = materials.filter((material) => material.cohort === '1');

    if (selectedWeek !== 'all') {
      filtered = filtered.filter((material) => material.week === selectedWeek);
    }

    if (userRole === 'student') {
      filtered = filtered.filter((material) => material.isPublished);
    }

    return filtered.sort((a, b) => a.week - b.week);
  };

  const handleCreateMaterial = () => {
    setModalType('create');
    setFormData({
      title: '',
      description: '',
      week: 1,
      cohort: '1',
      fileName: '',
      fileSize: '',
      fileType: 'PDF',
      isPublished: true,
    });
    modal.openModal();
  };

  const handleEditMaterial = (material: LearningMaterial) => {
    setModalType('edit');
    setFormData({
      title: material.title,
      description: material.description,
      week: material.week,
      cohort: material.cohort,
      fileName: material.fileName,
      fileSize: material.fileSize,
      fileType: material.fileType,
      isPublished: material.isPublished,
    });
    modal.openModal(material);
  };

  const handleViewMaterial = (material: LearningMaterial) => {
    setModalType('view');
    modal.openView(material);
  };

  const { submitting, submit: saveMaterial } = useAsyncSubmit(async () => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    if (modalType === 'create') {
      const newMaterial: LearningMaterial = {
        id: Date.now(),
        ...formData,
        uploadDate: now,
        fileUrl: `/materials/${formData.fileName}`,
      };
      setMaterials([...materials, newMaterial]);
    } else if (modalType === 'edit' && modal.selectedItem) {
      setMaterials(
        materials.map((material) => (material.id === modal.selectedItem!.id ? { ...material, ...formData } : material))
      );
    }

    modal.closeModal();
  });

  const deleteMaterial = (materialId: number) => {
    if (confirm('정말로 이 자료를 삭제하시겠습니까?')) {
      setMaterials(materials.filter((material) => material.id !== materialId));
    }
  };

  const togglePublished = (materialId: number) => {
    setMaterials(
      materials.map((material) =>
        material.id === materialId ? { ...material, isPublished: !material.isPublished } : material
      )
    );
  };

  const handleDownload = (material: LearningMaterial) => {
    // 실제로는 파일 다운로드 처리
    // 실제로는 파일 다운로드만 처리
    alert(`${material.fileName} 다운로드가 시작됩니다.`);
  };

  const getWeekStats = () => {
    const filtered = materials.filter((m) => m.cohort === '1');
    const weeks = [...new Set(filtered.map((m) => m.week))].sort();
    return weeks.map((week) => ({
      week,
      count: filtered.filter((m) => m.week === week).length,
      published: filtered.filter((m) => m.week === week && m.isPublished).length,
    }));
  };

  return (
    <div className='space-y-6'>
      {/* 헤더 */}
      <AdminPageHeader
        icon={<FolderOpenIcon className='w-6 h-6 text-slate-600' />}
        title='주차별 학습자료'
        description={
          userRole === 'admin' ? '1기 주차별 학습자료를 업로드하고 관리하세요' : '1기 주차별 학습자료를 확인하고 다운로드하세요'
        }
        actions={
          <>
            {/* 주차 선택 */}
            <Select
              value={selectedWeek === 'all' ? 'all' : selectedWeek.toString()}
              onChange={(value) => setSelectedWeek(value === 'all' ? 'all' : Number(value))}
              options={[
                { value: 'all', label: '전체 주차' },
                ...availableWeeks.map((week) => ({
                  value: week.toString(),
                  label: `${week}주차`,
                })),
              ]}
              className='px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />

            {userRole === 'admin' && (
              <button
                onClick={handleCreateMaterial}
                className='flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
              >
                <PlusIcon className='w-4 h-4' />
                <span>자료 업로드</span>
              </button>
            )}
          </>
        }
      />

      {/* 자료 목록 */}
      <div className='bg-white rounded-2xl border border-slate-200 shadow-sm'>
        <div className='p-6 border-b border-slate-200'>
          <h2 className='text-xl font-semibold text-slate-900'>
            1기 {selectedWeek === 'all' ? '전체' : `${selectedWeek}주차`} 학습자료
          </h2>
        </div>

        {getFilteredMaterials().length === 0 ? (
          <div className='p-12 text-center text-slate-500'>
            <FolderOpenIcon className='w-16 h-16 mx-auto mb-4 opacity-50' />
            <div className='space-y-2'>
              <p className='text-lg mb-2'>📚 주차별 학습자료</p>

              <p className='text-sm text-slate-400 mt-4'>곧 체계적인 학습자료를 제공해드릴 예정입니다!</p>
            </div>
          </div>
        ) : (
          <div className='divide-y divide-slate-200'>
            {getFilteredMaterials().map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                userRole={userRole}
                onView={handleViewMaterial}
                onEdit={handleEditMaterial}
                onDelete={deleteMaterial}
                onDownload={handleDownload}
                onTogglePublished={togglePublished}
              />
            ))}
          </div>
        )}
      </div>

      <MaterialModal
        show={modal.isOpen || !!modal.viewItem}
        type={modalType}
        material={modal.viewItem || modal.selectedItem}
        formData={formData}
        availableWeeks={availableWeeks}
        onClose={() => {
          modal.closeModal();
          modal.closeView();
        }}
        onSave={saveMaterial}
        onDownload={handleDownload}
        onFormDataChange={setFormData}
      />
    </div>
  );
}

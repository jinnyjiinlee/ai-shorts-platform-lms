'use client';

import { useState } from 'react';
import { FolderOpenIcon } from '@heroicons/react/24/outline';
import UniversalBoard, { BoardItem } from '@/features/shared/board/components/UniversalBoard';
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

  // LearningMaterial을 BoardItem으로 변환
  const boardItems: BoardItem[] = getFilteredMaterials().map((material) => ({
    id: material.id.toString(),
    title: `${material.week}주차 - ${material.title}`,
    content: material.description,
    author: '관리자',
    createdAt: new Date(material.uploadDate).toLocaleDateString('ko-KR'),
    isPublished: material.isPublished,
    badges: [
      <span key="type" className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
        {material.fileType}
      </span>,
      <span key="size" className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
        {material.fileSize}
      </span>
    ],
  }));

  return (
    <div className="space-y-6">
      {/* 주차 필터 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">주차별 필터</h3>
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
            className="w-40"
          />
        </div>
      </div>

      {/* UniversalBoard 사용 */}
      <UniversalBoard
        title="주차별 학습자료"
        description={
          userRole === 'admin' ? '1기 주차별 학습자료를 업로드하고 관리하세요' : '1기 주차별 학습자료를 확인하고 다운로드하세요'
        }
        icon={<FolderOpenIcon className="w-6 h-6 text-orange-600" />}
        iconBgColor="bg-orange-100"
        createButtonText="자료 업로드"
        items={boardItems}
        userRole={userRole}
        onCreateItem={userRole === 'admin' ? handleCreateMaterial : undefined}
        onViewItem={(item) => {
          const material = materials.find((m) => m.id.toString() === item.id);
          if (material) handleViewMaterial(material);
        }}
        onEditItem={(item) => {
          const material = materials.find((m) => m.id.toString() === item.id);
          if (material && userRole === 'admin') handleEditMaterial(material);
        }}
        onDeleteItem={(id) => {
          if (userRole === 'admin') {
            deleteMaterial(Number(id));
          }
        }}
        extraActions={(item) => {
          const material = materials.find((m) => m.id.toString() === item.id);
          if (!material) return [];
          
          const actions = [
            // 다운로드 버튼
            <button
              key="download"
              onClick={() => handleDownload(material)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="다운로드"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          ];

          // 관리자만 발행 상태 토글 버튼 추가
          if (userRole === 'admin') {
            actions.push(
              <button
                key="toggle"
                onClick={() => togglePublished(material.id)}
                className={`p-2 rounded-lg transition-colors ${
                  material.isPublished
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={material.isPublished ? '비공개로 변경' : '공개하기'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={material.isPublished
                      ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    }
                  />
                </svg>
              </button>
            );
          }

          return actions;
        }}
      />

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

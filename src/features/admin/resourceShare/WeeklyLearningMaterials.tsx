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
      {/* UniversalBoard에 필터를 헤더 액션으로 통합 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <FolderOpenIcon className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">주차별 학습자료</h1>
            <p className="text-slate-600">
              {userRole === 'admin' ? '1기 주차별 학습자료를 업로드하고 관리하세요' : '1기 주차별 학습자료를 확인하고 다운로드하세요'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* 주차 필터 */}
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
          
          {/* 자료 업로드 버튼 */}
          {userRole === 'admin' && (
            <button
              onClick={handleCreateMaterial}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>자료 업로드</span>
            </button>
          )}
        </div>
      </div>

      {/* 자료 목록 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        {boardItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FolderOpenIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <div className="space-y-2">
              <p className="text-lg mb-2">📚 주차별 학습자료</p>
              <p className="text-sm text-slate-400 mt-4">곧 체계적인 학습자료를 제공해드릴 예정입니다!</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {boardItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 
                        className="text-lg font-semibold text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => {
                          const material = materials.find((m) => m.id.toString() === item.id);
                          if (material) handleViewMaterial(material);
                        }}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {item.badges?.map((badge, index) => (
                          <span key={index}>{badge}</span>
                        ))}
                        {!item.isPublished && userRole === 'admin' && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                            임시저장
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {item.content && (
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{item.content}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>{item.author}</span>
                      <span>{item.createdAt}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {/* Extra Actions */}
                    {(() => {
                      const material = materials.find((m) => m.id.toString() === item.id);
                      if (!material) return null;
                      
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

                      // 관리자 액션들
                      if (userRole === 'admin') {
                        actions.push(
                          <button
                            key="edit"
                            onClick={() => handleEditMaterial(material)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="수정"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>,
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
                          </button>,
                          <button
                            key="delete"
                            onClick={() => deleteMaterial(material.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="삭제"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        );
                      }

                      return actions;
                    })()}
                  </div>
                </div>
              </div>
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

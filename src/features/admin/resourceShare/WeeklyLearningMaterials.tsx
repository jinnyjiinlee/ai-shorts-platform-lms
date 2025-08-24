'use client';

import { useState } from 'react';
import {
  PlusIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline';
import MaterialCard from './MaterialCard';
import MaterialModal from './MaterialModal';

interface LearningMaterial {
  id: number;
  title: string;
  description: string;
  week: number;
  cohort: number;
  uploadDate: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  isPublished: boolean;
}

interface WeeklyLearningMaterialsProps {
  userRole: 'admin' | 'student';
}

export default function WeeklyLearningMaterials({ userRole }: WeeklyLearningMaterialsProps) {
  const [materials, setMaterials] = useState<LearningMaterial[]>([
    {
      id: 1,
      title: '1주차 - 유튜브 쇼츠 시작하기',
      description: '유튜브 쇼츠의 기본 개념과 시작 방법에 대한 완전한 가이드입니다.<br><strong>포함 내용:</strong><br>• 쇼츠 생성 방법<br>• 기본 편집 툴 사용법<br>• 첫 영상 업로드하기',
      week: 1,
      cohort: 1,
      uploadDate: '2024-08-15 10:30',
      fileUrl: '/materials/week1-youtube-shorts-guide.pdf',
      fileName: '1주차_유튜브쇼츠가이드.pdf',
      fileSize: '12.5MB',
      fileType: 'PDF',
      isPublished: true
    },
    {
      id: 2,
      title: '2주차 - 콘텐츠 기획과 스토리텔링',
      description: '효과적인 콘텐츠 기획 방법과 시청자를 끌어당기는 스토리텔링 기법을 학습합니다.<br><br><mark style="background-color: #fef08a">중요한 부분은 형광펜으로 표시되어 있습니다!</mark>',
      week: 2,
      cohort: 1,
      uploadDate: '2024-08-22 14:20',
      fileUrl: '/materials/week2-content-planning.pdf',
      fileName: '2주차_콘텐츠기획.pdf',
      fileSize: '8.7MB',
      fileType: 'PDF',
      isPublished: true
    },
    {
      id: 3,
      title: '3주차 - 편집 고급 기법',
      description: '프로페셔널한 쇼츠 제작을 위한 고급 편집 기법들을 다룹니다.',
      week: 3,
      cohort: 1,
      uploadDate: '2024-08-29 09:15',
      fileUrl: '/materials/week3-advanced-editing.pdf',
      fileName: '3주차_고급편집기법.pdf',
      fileSize: '15.2MB',
      fileType: 'PDF',
      isPublished: false
    }
  ]);

  const [selectedCohort, setSelectedCohort] = useState<number>(1);
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    week: 1,
    cohort: 1,
    fileName: '',
    fileSize: '',
    fileType: '',
    isPublished: true
  });

  // 기수 목록 (확장 가능)
  const availableCohorts = [1, 2, 3];
  const availableWeeks = Array.from({ length: 16 }, (_, i) => i + 1); // 1주차부터 16주차까지

  // 필터링된 자료 목록
  const getFilteredMaterials = () => {
    let filtered = materials.filter(material => material.cohort === selectedCohort);
    
    if (selectedWeek !== 'all') {
      filtered = filtered.filter(material => material.week === selectedWeek);
    }
    
    if (userRole === 'student') {
      filtered = filtered.filter(material => material.isPublished);
    }
    
    return filtered.sort((a, b) => a.week - b.week);
  };

  const handleCreateMaterial = () => {
    setModalType('create');
    setFormData({
      title: '',
      description: '',
      week: 1,
      cohort: selectedCohort,
      fileName: '',
      fileSize: '',
      fileType: 'PDF',
      isPublished: true
    });
    setShowModal(true);
  };

  const handleEditMaterial = (material: LearningMaterial) => {
    setModalType('edit');
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      week: material.week,
      cohort: material.cohort,
      fileName: material.fileName,
      fileSize: material.fileSize,
      fileType: material.fileType,
      isPublished: material.isPublished
    });
    setShowModal(true);
  };

  const handleViewMaterial = (material: LearningMaterial) => {
    setModalType('view');
    setSelectedMaterial(material);
    setShowModal(true);
  };

  const saveMaterial = () => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    if (modalType === 'create') {
      const newMaterial: LearningMaterial = {
        id: Date.now(),
        ...formData,
        uploadDate: now,
        fileUrl: `/materials/${formData.fileName}`,
      };
      setMaterials([...materials, newMaterial]);
    } else if (modalType === 'edit' && selectedMaterial) {
      setMaterials(materials.map(material => 
        material.id === selectedMaterial.id 
          ? { ...material, ...formData }
          : material
      ));
    }
    
    setShowModal(false);
  };

  const deleteMaterial = (materialId: number) => {
    if (confirm('정말로 이 자료를 삭제하시겠습니까?')) {
      setMaterials(materials.filter(material => material.id !== materialId));
    }
  };

  const togglePublished = (materialId: number) => {
    setMaterials(materials.map(material => 
      material.id === materialId 
        ? { ...material, isPublished: !material.isPublished }
        : material
    ));
  };

  const handleDownload = (material: LearningMaterial) => {
    // 실제로는 파일 다운로드 처리
    // 실제로는 파일 다운로드만 처리
    alert(`${material.fileName} 다운로드가 시작됩니다.`);
  };


  const getWeekStats = () => {
    const filtered = materials.filter(m => m.cohort === selectedCohort);
    const weeks = [...new Set(filtered.map(m => m.week))].sort();
    return weeks.map(week => ({
      week,
      count: filtered.filter(m => m.week === week).length,
      published: filtered.filter(m => m.week === week && m.isPublished).length
    }));
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <FolderOpenIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">주차별 학습자료</h1>
              <p className="text-green-100 text-lg">
                {userRole === 'admin' ? '주차별 학습자료를 업로드하고 관리하세요' : '주차별 학습자료를 확인하고 다운로드하세요'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 기수 선택 */}
            <div className="flex items-center space-x-2">
              <label className="text-green-100 font-medium text-sm">기수</label>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(parseInt(e.target.value))}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {availableCohorts.map(cohort => (
                  <option key={cohort} value={cohort} className="text-slate-800">{cohort}기</option>
                ))}
              </select>
            </div>
            
            {/* 주차 선택 */}
            <div className="flex items-center space-x-2">
              <label className="text-green-100 font-medium text-sm">주차</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-4 py-2 bg-white/20 border border-white/30 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="all" className="text-slate-800">전체 주차</option>
                {availableWeeks.map(week => (
                  <option key={week} value={week} className="text-slate-800">{week}주차</option>
                ))}
              </select>
            </div>
            
            {userRole === 'admin' && (
              <button
                onClick={handleCreateMaterial}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                <span>자료 업로드</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 주차별 통계 (admin만 보임) */}
      {userRole === 'admin' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{selectedCohort}기 주차별 자료 현황</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {getWeekStats().map(stat => (
              <div key={stat.week} className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-lg font-bold text-slate-900">{stat.week}주차</div>
                <div className="text-sm text-slate-600">{stat.published}/{stat.count}개 공개</div>
                <div className={`w-full h-1 rounded mt-2 ${
                  stat.count === 0 ? 'bg-slate-200' :
                  stat.published === stat.count ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 자료 목록 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {selectedCohort}기 {selectedWeek === 'all' ? '전체' : `${selectedWeek}주차`} 학습자료
          </h2>
        </div>
        
        {getFilteredMaterials().length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FolderOpenIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">아직 업로드된 자료가 없습니다.</p>
            {userRole === 'admin' && (
              <button
                onClick={handleCreateMaterial}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                첫 번째 자료 업로드하기
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
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
        show={showModal}
        type={modalType}
        material={selectedMaterial}
        formData={formData}
        availableWeeks={availableWeeks}
        availableCohorts={availableCohorts}
        onClose={() => setShowModal(false)}
        onSave={saveMaterial}
        onDownload={handleDownload}
        onFormDataChange={setFormData}
      />
    </div>
  );
}
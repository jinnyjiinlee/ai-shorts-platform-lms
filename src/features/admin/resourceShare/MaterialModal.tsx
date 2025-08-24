'use client';

import { useState, useRef } from 'react';
import { ArrowDownTrayIcon, CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from '../community/columns/MarkdownEditor';

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

type MaterialFormData = {
  title: string;
  description: string;
  week: number;
  cohort: number;
  fileName: string;
  fileSize: string;
  fileType: string;
  isPublished: boolean;
};

interface MaterialModalProps {
  show: boolean;
  type: 'create' | 'edit' | 'view';
  material?: LearningMaterial | null;
  formData: MaterialFormData;
  availableWeeks: number[];
  availableCohorts: number[];
  onClose: () => void;
  onSave: () => void;
  onDownload?: (material: LearningMaterial) => void;
  onFormDataChange: (data: MaterialFormData) => void;
}

export default function MaterialModal({
  show,
  type,
  material,
  formData,
  availableWeeks,
  availableCohorts,
  onClose,
  onSave,
  onDownload,
  onFormDataChange,
}: MaterialModalProps) {
  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
        {/* 자료 생성/수정 모달 */}
        {(type === 'create' || type === 'edit') && (
          <>
            <div className='p-6 border-b border-slate-200'>
              <h3 className='text-xl font-semibold text-slate-900'>
                {type === 'create' ? '새 학습자료 업로드' : '학습자료 수정'}
              </h3>
            </div>
            <div className='p-6 space-y-6'>
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>자료 제목</label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
                  className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='학습자료 제목을 입력하세요'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-slate-700 mb-2'>자료 설명</label>
                <MarkdownEditor
                  value={formData.description}
                  onChange={(value: string) => onFormDataChange({ ...formData, description: value })}
                  placeholder='마크다운으로 학습자료에 대한 자세한 설명을 입력하세요!'
                  className='min-h-[200px]'
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>주차</label>
                  <select
                    value={formData.week}
                    onChange={(e) => onFormDataChange({ ...formData, week: parseInt(e.target.value) })}
                    className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    {availableWeeks.map((week) => (
                      <option key={week} value={week}>
                        {week}주차
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-slate-700 mb-2'>기수</label>
                  <select
                    value={formData.cohort}
                    onChange={(e) => onFormDataChange({ ...formData, cohort: parseInt(e.target.value) })}
                    className='w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  >
                    {availableCohorts.map((cohort) => (
                      <option key={cohort} value={cohort}>
                        {cohort}기
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 드래그 앤 드롭 파일 업로드 */}
              <FileUploadArea onFormDataChange={onFormDataChange} formData={formData} />

              <div className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.isPublished}
                  onChange={(e) => onFormDataChange({ ...formData, isPublished: e.target.checked })}
                  className='rounded border-gray-300'
                />
                <label className='ml-2 text-sm text-slate-700'>즉시 공개</label>
              </div>
            </div>
            <div className='p-6 border-t border-slate-200 flex justify-end space-x-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
              >
                취소
              </button>
              <button
                onClick={onSave}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                {type === 'create' ? '업로드' : '수정'}
              </button>
            </div>
          </>
        )}

        {/* 자료 상세보기 모달 */}
        {type === 'view' && material && (
          <>
            <div className='p-6 border-b border-slate-200'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='text-xl font-semibold text-slate-900'>{material.title}</h3>
                  <div className='flex items-center space-x-3 mt-2'>
                    <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                      {material.week}주차
                    </span>
                    <span className='px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs'>
                      {material.cohort}기
                    </span>
                  </div>
                </div>
                <button onClick={onClose} className='text-slate-400 hover:text-slate-600'>
                  <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
            </div>

            <div className='p-6 space-y-6'>
              <div>
                <h4 className='font-medium text-slate-900 mb-2'>자료 설명</h4>
                <div
                  className='text-slate-600 prose prose-sm max-w-none'
                  dangerouslySetInnerHTML={{ __html: material.description }}
                />
              </div>

              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                <div>
                  <span className='font-medium text-slate-700'>파일명:</span>
                  <p className='text-slate-600'>{material.fileName}</p>
                </div>
                <div>
                  <span className='font-medium text-slate-700'>크기:</span>
                  <p className='text-slate-600'>{material.fileSize}</p>
                </div>
                <div>
                  <span className='font-medium text-slate-700'>업로드일:</span>
                  <p className='text-slate-600'>{material.uploadDate}</p>
                </div>
              </div>
            </div>

            <div className='p-6 border-t border-slate-200 flex justify-between'>
              <button
                onClick={onClose}
                className='px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
              >
                닫기
              </button>

              {onDownload && (
                <button
                  onClick={() => onDownload(material)}
                  className='flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                >
                  <ArrowDownTrayIcon className='w-4 h-4' />
                  <span>다운로드</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 드래그 앤 드롭 파일 업로드 컴포넌트
function FileUploadArea({
  onFormDataChange,
  formData,
}: {
  onFormDataChange: (data: MaterialFormData) => void;
  formData: MaterialFormData;
}) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const fileName = file.name;
    const fileSize = formatFileSize(file.size);
    const fileType = getFileType(fileName);

    onFormDataChange({
      ...formData,
      fileName,
      fileSize,
      fileType,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'ppt':
      case 'pptx':
        return 'PPT';
      case 'doc':
      case 'docx':
        return 'DOCX';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'VIDEO';
      default:
        return 'PDF';
    }
  };

  return (
    <div>
      <label className='block text-sm font-medium text-slate-700 mb-2'>파일 업로드</label>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type='file'
          className='hidden'
          accept='.pdf,.ppt,.pptx,.doc,.docx,.mp4,.avi,.mov'
          onChange={handleFileSelect}
        />

        <div className='flex flex-col items-center space-y-4'>
          {formData.fileName ? (
            <>
              <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                <DocumentIcon className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <p className='text-sm font-medium text-slate-900'>{formData.fileName}</p>
                <p className='text-xs text-slate-500'>
                  {formData.fileSize} • {formData.fileType}
                </p>
              </div>
              <button
                type='button'
                className='text-xs text-blue-600 hover:text-blue-800 underline'
                onClick={(e) => {
                  e.stopPropagation();
                  onFormDataChange({
                    ...formData,
                    fileName: '',
                    fileSize: '',
                    fileType: 'PDF',
                  });
                }}
              >
                다른 파일 선택
              </button>
            </>
          ) : (
            <>
              <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                <CloudArrowUpIcon className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <p className='text-sm font-medium text-slate-900'>파일을 여기로 드래그하세요</p>
                <p className='text-xs text-slate-500'>또는 클릭해서 파일을 선택하세요</p>
              </div>
              <div className='flex flex-wrap gap-2 justify-center'>
                <span className='px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs'>PDF</span>
                <span className='px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs'>PPT</span>
                <span className='px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs'>Word</span>
                <span className='px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs'>동영상</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

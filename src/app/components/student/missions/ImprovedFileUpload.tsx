'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImprovedFileUploadProps {
  submissionType: 'file' | 'text';
  missionId?: string;
  onSubmissionComplete?: () => void;
  isSubmitted?: boolean;
  dueDate?: string;
}

import { submitMission } from '../../../../lib/services/missions/submissionService';

export default function ImprovedFileUpload({ 
  submissionType, 
  missionId,
  onSubmissionComplete,
  isSubmitted = false,
  dueDate
}: ImprovedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmission = async (retryCount = 0) => {
    if (!missionId) {
      alert('미션 ID가 없습니다.');
      return;
    }

    const maxRetries = 3;

    try {
      setIsSubmitting(true);
      
      if (submissionType === 'file' && selectedFile) {
        await submitMission({
          missionId,
          submissionType: 'file',
          file: selectedFile
        });
      } else if (submissionType === 'text' && textContent.trim()) {
        await submitMission({
          missionId,
          submissionType: 'text',
          content: textContent
        });
      } else {
        alert('제출할 내용이 없습니다.');
        return;
      }

      onSubmissionComplete?.();
    } catch (error) {
      console.error('제출 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '제출 중 알 수 없는 오류가 발생했습니다.';
      
      // 네트워크 오류이고 재시도 횟수가 남아있으면 재시도
      if (errorMessage.includes('네트워크') && retryCount < maxRetries) {
        console.log(`재시도 ${retryCount + 1}/${maxRetries}...`);
        setTimeout(() => {
          handleSubmission(retryCount + 1);
        }, 2000 * (retryCount + 1)); // 점진적 지연
        return;
      }

      // 재시도 실패하거나 다른 오류인 경우
      if (retryCount >= maxRetries) {
        alert(`❌ ${maxRetries}번 시도했지만 실패했습니다. 잠시 후 다시 시도해주세요.\n\n오류: ${errorMessage}`);
      } else {
        alert(`❌ ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 마감일 확인
  const isOverdue = dueDate ? new Date(dueDate) < new Date() : false;
  const canResubmit = isSubmitted && !isOverdue;

  // 제출 완료되었지만 마감일이 지난 경우
  if (isSubmitted && isOverdue) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center text-green-800">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">제출 완료</p>
            <p className="text-sm mt-1">마감일이 지나 수정할 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 재제출 안내 */}
      {isSubmitted && canResubmit && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center text-blue-800">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-sm">이미 제출된 미션입니다</p>
              <p className="text-xs mt-1">마감일({dueDate})까지 다시 제출할 수 있습니다.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* 파일 업로드 영역 */}
      {(submissionType === 'file') && (
        <div>
          <h4 className="font-medium text-slate-900 mb-3">파일 제출</h4>
          
          {!selectedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudArrowUpIcon className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
              <p className="text-lg font-medium text-slate-700 mb-2">
                {isDragging ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭하세요'}
              </p>
              <p className="text-sm text-slate-500">
                모든 파일 형식 지원 (최대 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <DocumentIcon className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-slate-900">{selectedFile.name}</p>
                    <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 텍스트/링크 입력 영역 */}
      {(submissionType === 'text' ) && (
        <div>
          <h4 className="font-medium text-slate-900 mb-3">텍스트 제출 (링크 포함 가능)</h4>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="링크나 텍스트 내용을 입력하세요...&#10;예: https://youtube.com/watch?v=..."
          />
          <p className="text-sm text-slate-500 mt-2">
            유튜브 링크, 구글 드라이브 링크, 또는 텍스트 설명을 입력할 수 있습니다.
          </p>
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <button 
          onClick={handleSubmission}
          disabled={isSubmitting || (!selectedFile && !textContent.trim())}
          className={`px-6 py-2 text-white rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed ${
            canResubmit 
              ? 'bg-orange-600 hover:bg-orange-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? '제출 중...' : canResubmit ? '다시 제출하기' : '제출하기'}
        </button>
      </div>
    </div>
  );
}
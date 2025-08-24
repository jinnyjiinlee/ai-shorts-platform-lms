'use client';

import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface FileUploadSectionProps {
  isSubmitted: boolean;
}

export default function FileUploadSection({ isSubmitted }: FileUploadSectionProps) {
  if (isSubmitted) {
    return (
      <div>
        <h4 className="font-medium text-slate-900 mb-3">제출된 파일</h4>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <DocumentArrowUpIcon className="w-8 h-8 text-slate-400" />
            <div>
              <p className="font-medium text-slate-900">미션_1주차_김철수.pdf</p>
              <p className="text-sm text-slate-500">2.3 MB • 2024-03-18 15:30</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="font-medium text-slate-900 mb-3">파일 제출</h4>
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className="text-slate-600 mb-2">파일을 드래그하거나 클릭하여 업로드</p>
        <button className="text-blue-600 hover:text-blue-500 font-medium">
          파일 선택
        </button>
        <p className="text-xs text-slate-400 mt-2">
          지원 형식: PDF, DOCX, MP4, MOV (최대 100MB)
        </p>
      </div>
    </div>
  );
}
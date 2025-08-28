'use client';

import MarkdownEditor from '../../columns/MarkdownEditor';
import { InputField } from '@/features/shared/ui/InputField';

interface AnnouncementFormProps {
  title: string;
  content: string;
  isImportant: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onImportantChange: (important: boolean) => void;
}

export default function AnnouncementForm({
  title,
  content,
  isImportant,
  onTitleChange,
  onContentChange,
  onImportantChange,
}: AnnouncementFormProps) {
  return (
    <div className='space-y-6'>
      <InputField
        label='공지사항 제목'
        value={title}
        onChange={onTitleChange}
        placeholder='공지사항 제목을 입력하세요'
        required
      />

      <div>
        <label className='block text-sm font-medium text-slate-700 mb-2'>공지사항 내용 *</label>
        <MarkdownEditor
          value={content}
          onChange={onContentChange}
          placeholder='마크다운으로 공지사항 내용을 작성하세요'
          className='min-h-[300px]'
        />
      </div>

      <div>
        <label className='flex items-center space-x-2'>
          <input
            type='checkbox'
            checked={isImportant}
            onChange={(e) => onImportantChange(e.target.checked)}
            className='rounded border-slate-300 text-blue-600 focus:ring-blue-500'
          />
          <span className='text-sm font-medium text-slate-700'>중요 공지사항으로 설정</span>
        </label>
        <p className='text-xs text-slate-500 mt-1'>중요 공지사항은 목록 상단에 고정되어 표시됩니다.</p>
      </div>
    </div>
  );
}

// admin - use
import { XMarkIcon } from '@heroicons/react/24/outline';
import MarkdownEditor from '../../community/columns/MarkdownEditor';

interface MissionFormModalProps {
  show: boolean;
  type: 'create' | 'edit';
  formData: {
    title: string;
    description: string;
    due_date: string;
    cohort: string;
    week: number;
  };
  onClose: () => void;
  onSave: () => void;
  onFormDataChange: (data: {
    title: string;
    description: string;
    due_date: string;
    cohort: string;
    week: number;
  }) => void;
}

export default function MissionFormModal({
  show,
  type,
  formData,
  onClose,
  onSave,
  onFormDataChange,
}: MissionFormModalProps) {
  if (!show) return null;

  return (
    <div className='fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
      <div className='bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20'>
        <div className='bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-3xl'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-2xl font-bold text-white'>{type === 'create' ? '새 미션 추가' : '미션 수정'}</h3>
              <p className='text-blue-100 text-sm mt-1'>수강생들이 도전할 새로운 미션을 만들어보세요</p>
            </div>
            <button
              onClick={onClose}
              className='text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200'
            >
              <XMarkIcon className='w-6 h-6' />
            </button>
          </div>
        </div>

        <div className='p-8 space-y-8'>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-3'>미션 제목</label>
            <input
              type='text'
              value={formData.title}
              onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
              className='w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-400 transition-colors bg-slate-50/50 hover:bg-white'
              placeholder='미션 제목을 입력하세요'
            />
          </div>

          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-3'>미션 설명</label>
            <div className='border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-white transition-colors'>
              <MarkdownEditor
                value={formData.description}
                onChange={(value: string) => onFormDataChange({ ...formData, description: value })}
                placeholder='마크다운으로 미션에 대한 자세한 설명을 입력하세요'
                className='min-h-[200px] border-0'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-slate-700'>주차</label>
              <input
                type='number'
                value={formData.week || ''}
                onChange={(e) => onFormDataChange({ ...formData, week: parseInt(e.target.value) || 0 })}
                className='w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-400 transition-colors bg-slate-50/50 hover:bg-white'
                min='1'
                max='20'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-slate-700'>마감일 및 시간</label>
              <input
                type='datetime-local'
                value={formData.due_date}
                onChange={(e) => onFormDataChange({ ...formData, due_date: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
                className='w-full px-4 py-3 border-2 border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-400 transition-colors bg-slate-50/50 hover:bg-white'
              />
              <p className='text-xs text-slate-500'>오늘 날짜 이후로만 설정할 수 있습니다</p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='block text-sm font-semibold text-slate-700'>대상 기수</label>
              <div className='w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl text-blue-700 font-semibold'>
                {formData.cohort}기 (현재 선택된 기수)
              </div>
              <p className='text-xs text-slate-500'>화면 상단에서 선택한 기수로 자동 설정됩니다</p>
            </div>
          </div>
        </div>

        <div className='p-8 bg-slate-50/50 rounded-b-3xl flex justify-end space-x-4'>
          <button
            onClick={onClose}
            className='px-6 py-3 border-2 border-slate-200 rounded-2xl hover:bg-white transition-all duration-200 font-medium text-slate-700 hover:shadow-md'
          >
            취소
          </button>
          <button
            onClick={onSave}
            className='px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          >
            {type === 'create' ? '✨ 미션 추가' : '📝 수정 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}

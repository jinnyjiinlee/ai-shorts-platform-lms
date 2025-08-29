import { CheckIcon } from '@heroicons/react/24/outline';

export default function ProfileActions({ isSaving, onSave, showToast, buttonText = '저장' }: any) {
  return <>
    <div className="flex justify-end">
      <button onClick={onSave} disabled={isSaving} className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 shadow-lg disabled:opacity-50">
        {isSaving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <CheckIcon className="w-5 h-5" />}
        <span>{isSaving ? `${buttonText} 중...` : buttonText}</span>
      </button>
    </div>
    {showToast && <div className="fixed top-4 right-4 z-50"><div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3"><CheckIcon className="w-6 h-6" /><span>{buttonText} 완료!</span></div></div>}
  </>;
}
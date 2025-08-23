import ReactMarkdown from 'react-markdown';
import { Mission } from '../../types';

interface MissionInfoTabProps {
  mission: Mission;
}

export default function MissionInfoTab({ mission }: MissionInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* 미션 기본 정보 */}
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-slate-700">주차:</span>
            <p className="mt-1">{mission.week}주차</p>
          </div>
          <div>
            <span className="font-medium text-slate-700">대상 기수:</span>
            <p className="mt-1">{mission.cohort}기</p>
          </div>
          <div>
            <span className="font-medium text-slate-700">마감일:</span>
            <p className="mt-1">{new Date(mission.due_date).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium text-slate-700">생성일:</span>
            <p className="mt-1">{new Date(mission.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="font-medium text-slate-700">제출 현황:</span>
            <p className="mt-1 font-medium text-blue-600">{mission.submissions?.length || 0}건 제출</p>
          </div>
        </div>
      </div>
      
      {/* 미션 설명 */}
      <div>
        <h4 className="font-medium text-slate-900 mb-3">📋 미션 설명</h4>
        <div className="prose prose-slate max-w-none bg-white border border-slate-200 rounded-lg p-4">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-slate-900 mt-5 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">{children}</h3>,
              p: ({ children }) => <p className="mb-3 text-slate-600 leading-relaxed whitespace-pre-wrap">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-3 text-slate-600 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-3 text-slate-600 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-slate-600">{children}</li>,
              strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">{children}</code>,
              blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 my-3 text-slate-700 italic">{children}</blockquote>,
              a: ({ href, children }) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>
            }}
          >
            {mission.description}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
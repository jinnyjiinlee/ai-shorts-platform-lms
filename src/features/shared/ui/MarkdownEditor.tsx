'use client';

import { useState, useRef } from 'react';
import { 
  BoldIcon, 
  ItalicIcon, 
  ListBulletIcon,
  LinkIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // 커서 위치 설정
    setTimeout(() => {
      textarea.focus();
      const newPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertText('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertText('*', '*');
          break;
      }
    }
  };

  // 간단한 마크다운을 HTML로 변환
  const markdownToHtml = (markdown: string) => {
    let html = markdown;
    
    // 헤더 - 여백 완전 제거
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-0 mt-4 first:mt-0">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-0 mt-3 first:mt-0">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-0 mt-2 first:mt-0">$1</h3>');
    
    // 굵은 글씨
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // 기울임
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // 링크
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>');
    
    // 헤더 다음의 빈 줄 제거 (여백 방지)
    html = html.replace(/(<\/h[123]>)<br>/g, '$1');
    
    // 리스트 처리 - 줄바꿈 처리 전에 먼저 처리
    const listItems = html.split('\n');
    let processedHtml = '';
    let inList = false;
    let listType = '';
    
    for (let i = 0; i < listItems.length; i++) {
      const line = listItems[i];
      const bulletMatch = line.match(/^\* (.*)$/);
      const numberMatch = line.match(/^(\d+)\. (.*)$/);
      
      if (bulletMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) processedHtml += `</${listType}>`;
          processedHtml += '<ul class="space-y-1 my-2">';
          inList = true;
          listType = 'ul';
        }
        processedHtml += `<li class="flex items-start"><span class="mr-2">•</span><span>${bulletMatch[1]}</span></li>`;
      } else if (numberMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) processedHtml += `</${listType}>`;
          processedHtml += '<ol class="space-y-1 my-2">';
          inList = true;
          listType = 'ol';
        }
        processedHtml += `<li class="flex items-start"><span class="mr-2">${numberMatch[1]}.</span><span>${numberMatch[2]}</span></li>`;
      } else {
        if (inList) {
          processedHtml += `</${listType}>`;
          inList = false;
          listType = '';
        }
        processedHtml += line + '\n';
      }
    }
    
    if (inList) {
      processedHtml += `</${listType}>`;
    }
    
    html = processedHtml;
    
    // 줄바꿈을 <br>로 변환
    html = html.replace(/\n/g, '<br>');
    
    // 헤더 바로 다음의 <br> 태그 제거 (여백 완전 제거)
    html = html.replace(/(<\/h[123]>)<br>/g, '$1');
    
    return html;
  };

  return (
    <div className={`border border-slate-300 rounded-xl overflow-hidden ${className}`}>
      {/* 툴바 */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* 텍스트 스타일 */}
          <button
            type="button"
            onClick={() => insertText('**', '**')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title="굵게 (Ctrl+B)"
          >
            <BoldIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText('*', '*')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title="기울임 (Ctrl+I)"
          >
            <ItalicIcon className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-slate-300 mx-2"></div>
          
          {/* 헤더 버튼들 */}
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => insertText('# ')}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              title="대제목 (# 제목)"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => insertText('## ')}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              title="중제목 (## 제목)"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertText('### ')}
              className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-xs font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              title="소제목 (### 제목)"
            >
              H3
            </button>
          </div>
          
          {/* 리스트 */}
          <button
            type="button"
            onClick={() => {
              const textarea = textareaRef.current;
              if (!textarea) return;
              
              const start = textarea.selectionStart;
              const lineStart = value.lastIndexOf('\n', start - 1) + 1;
              const currentLine = value.substring(lineStart, start);
              
              // 현재 줄이 비어있거나 줄의 시작이면 새 줄에 리스트 추가
              if (currentLine.trim() === '' || start === lineStart) {
                insertText('* ');
              } else {
                // 현재 줄 끝에서 엔터를 치고 리스트 추가
                insertText('\n* ');
              }
            }}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title="리스트"
          >
            <ListBulletIcon className="w-4 h-4" />
          </button>
          
          {/* 링크 */}
          <button
            type="button"
            onClick={() => insertText('[링크 텍스트](URL)')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title="링크"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
        
        {/* 미리보기 토글 */}
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
            showPreview ? 'bg-blue-100 text-blue-700' : 'hover:bg-slate-200'
          }`}
        >
          {showPreview ? (
            <>
              <PencilIcon className="w-4 h-4" />
              <span className="text-sm">편집</span>
            </>
          ) : (
            <>
              <EyeIcon className="w-4 h-4" />
              <span className="text-sm">미리보기</span>
            </>
          )}
        </button>
      </div>

      <div className="flex">
        {/* 에디터 영역 */}
        <div className={`${showPreview ? 'w-1/2 border-r border-slate-200' : 'w-full'} transition-all`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[300px] p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            placeholder={placeholder || '마크다운으로 작성하세요...\n\n예시:\n# 제목\n## 소제목\n**굵은 글씨**\n*기울임*\n* 리스트\n[링크](URL)'}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
            }}
          />
        </div>

        {/* 미리보기 영역 */}
        {showPreview && (
          <div className="w-1/2 bg-slate-25">
            <div className="p-4 h-full">
              <h3 className="text-sm font-medium text-slate-500 mb-3">미리보기</h3>
              <div 
                className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: value ? markdownToHtml(value) : '<p class="text-slate-400">내용을 입력하면 미리보기가 여기에 표시됩니다.</p>'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 도움말 */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2">
        <p className="text-xs text-slate-500">
          <strong>팁:</strong> **굵게**, *기울임*, # 대제목, ## 중제목, ### 소제목, * 리스트, [링크](URL) 형식으로 작성하세요. Ctrl+B(굵게), Ctrl+I(기울임) 단축키 사용 가능
        </p>
      </div>
    </div>
  );
}
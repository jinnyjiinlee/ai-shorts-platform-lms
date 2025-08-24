'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  BoldIcon, 
  ItalicIcon, 
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  
  // value prop 변경 시 에디터 내용 동기화 (초기 로드시에만)
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (editorRef.current && !isComposing) {
      // 초기 로드 시에만 value를 설정
      if (!isInitialized) {
        editorRef.current.innerHTML = value || '';
        setIsInitialized(true);
      }
    }
  }, [value, isComposing, isInitialized]);

  // 디바운스된 onChange 호출
  const debouncedOnChange = useRef<NodeJS.Timeout | null>(null);

  const updateContent = () => {
    // 한글 조합 중이면 업데이트 건너뜀
    if (isComposing) return;
    
    if (debouncedOnChange.current) {
      clearTimeout(debouncedOnChange.current);
    }

    debouncedOnChange.current = setTimeout(() => {
      if (editorRef.current && !isComposing) {
        const content = editorRef.current.innerHTML;
        const cleaned = cleanContent(content);
        // 현재 값과 다를 때만 업데이트
        if (cleaned !== value) {
          onChange(cleaned);
        }
      }
    }, 150); // 디바운스 시간을 약간 늘림
  };

  // 컴포넌트 언마운트시 타이머 정리
  useEffect(() => {
    return () => {
      if (debouncedOnChange.current) {
        clearTimeout(debouncedOnChange.current);
      }
    };
  }, []);
  
  const colors = [
    { name: '검정', value: '#000000' },
    { name: '빨강', value: '#ef4444' },
    { name: '파랑', value: '#3b82f6' },
    { name: '초록', value: '#10b981' },
    { name: '보라', value: '#8b5cf6' },
    { name: '주황', value: '#f97316' },
  ];

  const highlightColors = [
    { name: '노란 형광펜', value: '#fef08a' },
    { name: '파란 형광펜', value: '#bfdbfe' },
    { name: '초록 형광펜', value: '#bbf7d0' },
    { name: '분홍 형광펜', value: '#fce7f3' },
    { name: '보라 형광펜', value: '#e9d5ff' },
  ];

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current && !isComposing) {
      document.execCommand(command, false, value);
      // 명령 실행 후 내용 업데이트
      setTimeout(() => {
        if (editorRef.current) {
          onChange(editorRef.current.innerHTML);
        }
      }, 0);
    }
  };

  const handleColorChange = (color: string) => {
    execCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const handleHighlightChange = (color: string) => {
    execCommand('backColor', color);
    setShowHighlightPicker(false);
  };

  // 컨텐츠를 정리하는 헬퍼 함수
  const cleanContent = (content: string) => {
    let cleaned = content;
    
    // 빈 태그 처리
    if (cleaned === '<br>' || cleaned === '<div><br></div>' || cleaned === '<p><br></p>' || cleaned === '<div></div>') {
      cleaned = '';
    }
    
    // 불필요한 HTML 제거 및 한글 입력 최적화
    cleaned = cleaned.replace(/<div><\/div>/g, '');
    cleaned = cleaned.replace(/<div>/g, '<br>');
    cleaned = cleaned.replace(/<\/div>/g, '');
    cleaned = cleaned.replace(/<br><br>/g, '<br>');
    
    return cleaned;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // 단축키 지원
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };

  // IME 입력 처리를 위한 이벤트 핸들러들
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLDivElement>) => {
    setTimeout(() => {
      setIsComposing(false);
      updateContent();
    }, 0);
  };

  return (
    <div className={`border border-slate-300 rounded-xl overflow-hidden ${className}`}>
      {/* 툴바 */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap gap-2">
        {/* 텍스트 스타일 */}
        <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors hover:scale-105 active:scale-95"
            title="굵게 (Ctrl+B)"
          >
            <BoldIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors hover:scale-105 active:scale-95"
            title="기울임 (Ctrl+I)"
          >
            <ItalicIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors hover:scale-105 active:scale-95"
            title="밑줄 (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 폰트 크기 */}
        <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
          <select
            onChange={(e) => execCommand('fontSize', e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2 py-1"
            defaultValue="3"
          >
            <option value="1">작게</option>
            <option value="3">보통</option>
            <option value="5">크게</option>
            <option value="7">매우 크게</option>
          </select>
        </div>

        {/* 색상 */}
        <div className="flex items-center space-x-1 border-r border-slate-300 pr-2 relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50 transition-colors"
          >
            글자색
          </button>
          {showColorPicker && (
            <div className="absolute top-10 left-0 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-10">
              <div className="grid grid-cols-3 gap-1">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleColorChange(color.value)}
                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 형광펜 */}
        <div className="flex items-center space-x-1 border-r border-slate-300 pr-2 relative">
          <button
            type="button"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            className="px-3 py-1 bg-white border border-slate-300 rounded text-xs hover:bg-slate-50 transition-colors"
          >
            형광펜
          </button>
          {showHighlightPicker && (
            <div className="absolute top-10 left-0 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-10">
              <div className="grid grid-cols-3 gap-1">
                {highlightColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleHighlightChange(color.value)}
                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 리스트 */}
        <div className="flex items-center space-x-1 border-r border-slate-300 pr-2">
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title="글머리 기호"
          >
            <ListBulletIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
            title="번호 매기기"
          >
            <NumberedListIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex items-center space-x-1">
          <select
            onChange={(e) => execCommand(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2 py-1"
            defaultValue="justifyLeft"
          >
            <option value="justifyLeft">왼쪽 정렬</option>
            <option value="justifyCenter">가운데 정렬</option>
            <option value="justifyRight">오른쪽 정렬</option>
          </select>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: value || '' }}
        onInput={() => {
          if (!isComposing) {
            updateContent();
          }
        }}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={(e) => {
          if (!value || value.trim() === '') {
            e.currentTarget.innerHTML = '';
          }
        }}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData?.getData('text/plain') || '';
          if (!isComposing && text) {
            document.execCommand('insertText', false, text);
            updateContent();
          }
        }}
        className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-all"
        style={{ 
          wordBreak: 'break-word',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          imeMode: 'active'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
          position: absolute;
        }
        [contenteditable] {
          position: relative;
        }
        [contenteditable]:focus:empty::before {
          content: '';
        }
      `}</style>
    </div>
  );
}
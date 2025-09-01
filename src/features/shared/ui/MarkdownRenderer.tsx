'use client';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// 마크다운을 플레인 텍스트로 변환하는 함수 (미리보기용)
export const markdownToPlainText = (markdown: string): string => {
  return markdown
    // 헤더 제거
    .replace(/^#{1,6}\s+/gm, '')
    // 볼드/이탤릭 제거
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // 링크 제거 [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 코드 블록 제거
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // 리스트 마커 제거
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // 여러 줄바꿈을 하나로
    .replace(/\n+/g, ' ')
    // 앞뒤 공백 제거
    .trim();
};

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // 간단한 마크다운 파싱 (기본적인 것들만)
  const parseMarkdown = (text: string) => {
    let html = text;
    
    // 헤더 처리 - 여백 완전 제거
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-2 mb-0 first:mt-0">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-3 mb-0 first:mt-0">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-0 first:mt-0">$1</h1>');
    
    // 볼드 처리 **text** 또는 __text__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // 이탤릭 처리 *text* 또는 _text_ (볼드를 제외하고)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // 링크 처리 [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // 코드 블록 처리 ```code```
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded-md overflow-x-auto my-2"><code>$1</code></pre>');
    
    // 인라인 코드 처리 `code`
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');
    
    // 리스트 처리 - 더 간단한 방법
    html = html.replace(/^- (.*$)/gim, '<li class="flex items-start"><span class="mr-2">•</span><span>$1</span></li>');
    html = html.replace(/^\* (.*$)/gim, '<li class="flex items-start"><span class="mr-2">•</span><span>$1</span></li>');
    html = html.replace(/^(\d+)\. (.*$)/gim, '<li class="flex items-start"><span class="mr-2">$1.</span><span>$2</span></li>');
    
    // 줄바꿈 처리
    html = html.replace(/\n/g, '<br>');
    
    // 헤더 바로 다음의 <br> 태그 제거 (여백 완전 제거)
    html = html.replace(/(<\/h[123]>)<br>/g, '$1');
    
    return html;
  };

  const parsedContent = parseMarkdown(content);

  return (
    <div
      className={`prose prose-slate max-w-none leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: parsedContent }}
    />
  );
}
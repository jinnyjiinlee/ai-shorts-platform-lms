// 진행률 관련 유틸리티 함수들

export const calculateSubmissionRate = (submitted: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((submitted / total) * 100);
};

export const getProgressBarColor = (rate: number): string => {
  if (rate >= 80) return 'bg-green-500';
  if (rate >= 60) return 'bg-blue-500';
  if (rate >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getStatusColor = (rate: number): string => {
  if (rate >= 80) return 'text-green-600';
  if (rate >= 60) return 'text-blue-600';
  if (rate >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
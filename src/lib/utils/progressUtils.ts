// 진행률 관련 유틸리티 함수들

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


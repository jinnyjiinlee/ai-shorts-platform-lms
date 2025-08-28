export const dateUtils = {
  formatKorean(date: string | Date): string {
    return new Date(date).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  formatRelative(date: string | Date): string {
    const now = new Date();
    const target = new Date(date);
    const diffInMs = now.getTime() - target.getTime();

    const minutes = Math.floor(diffInMs / 60000);
    const hours = Math.floor(diffInMs / 3600000);
    const days = Math.floor(diffInMs / 86400000);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return this.formatKorean(date);
  },

  calculateRate(completed: number, total: number): number {
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  },
};

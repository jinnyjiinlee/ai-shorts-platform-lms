'use client';

export default function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">대시보드를 불러오는 중...</p>
      </div>
    </div>
  );
}
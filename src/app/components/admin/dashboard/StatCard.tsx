'use client';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    color: string;
  };
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  badge 
}: StatCardProps) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        {badge && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${badge.color}`}>
            {badge.text}
          </div>
        )}
      </div>
      
      <h3 className="text-sm font-medium text-slate-600 mb-1">{title}</h3>
      <p className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
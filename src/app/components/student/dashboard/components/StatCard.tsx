'use client';

import { ReactElement } from 'react';

interface StatCardProps {
  icon: ReactElement;
  value: string | number;
  label: string;
  bgColor: string;
  iconColor: string;
  textColor?: string;
}

export default function StatCard({ 
  icon, 
  value, 
  label, 
  bgColor, 
  iconColor, 
  textColor = 'text-slate-900' 
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center space-x-3">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
        <div>
          <div className={`text-2xl font-bold ${textColor}`}>
            {value}
          </div>
          <div className="text-sm text-slate-600">{label}</div>
        </div>
      </div>
    </div>
  );
}
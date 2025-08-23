'use client';

interface CohortSelectorProps {
  selectedCohort: number | 'all';
  onCohortChange: (cohort: number | 'all') => void;
  availableCohorts: number[];
}

export default function CohortSelector({ 
  selectedCohort, 
  onCohortChange, 
  availableCohorts 
}: CohortSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-slate-700">기수 선택:</label>
      <select
        value={selectedCohort}
        onChange={(e) => onCohortChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
        className="px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm"
      >
        <option value="all">전체 기수</option>
        {availableCohorts.map(cohort => (
          <option key={cohort} value={cohort}>
            {cohort}기
          </option>
        ))}
      </select>
    </div>
  );
}
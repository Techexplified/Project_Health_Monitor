import React from 'react';

export default function TaskStatusBars({
  completed = 84,
  ongoing = 25,
  overdue = 12,
  blocked = 7,
  totalCards = 128,
  completedInPeriod = 68
}) {
  const safeTotal = Math.max(1, completed + ongoing + overdue + blocked);

  const categories = [
    {
      label: 'Completed',
      count: completed,
      pct: Math.round((completed / safeTotal) * 100),
      color: 'bg-emerald-500',
      dotColor: 'bg-emerald-500'
    },
    {
      label: 'Ongoing',
      count: ongoing,
      pct: Math.round((ongoing / safeTotal) * 100),
      color: 'bg-blue-500',
      dotColor: 'bg-blue-500'
    },
    {
      label: 'Overdue',
      count: overdue,
      pct: Math.round((overdue / safeTotal) * 100),
      color: 'bg-rose-500',
      dotColor: 'bg-rose-500'
    },
    {
      label: 'Blocked',
      count: blocked,
      pct: Math.round((blocked / safeTotal) * 100),
      color: 'bg-slate-700',
      dotColor: 'bg-slate-700'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
          Task status
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {totalCards} cards • {completedInPeriod} completed in period
        </p>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${cat.dotColor}`}></span>
                <span className="font-semibold text-slate-700">{cat.label}</span>
              </div>
              <span className="font-bold text-slate-900">{cat.count}</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${cat.color} transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(100, Math.max(3, cat.pct))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

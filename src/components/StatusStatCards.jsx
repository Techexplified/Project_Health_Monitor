import React from 'react';
import { AlertTriangle, Clock, Ban, CheckCircle2 } from 'lucide-react';

export default function StatusStatCards({
  overdue = 12,
  dueSoon = 8,
  blocked = 7,
  completed = 84,
  onFilterClick
}) {
  const cards = [
    {
      id: 'overdue',
      label: 'Overdue',
      count: overdue,
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50/70 hover:bg-rose-50',
      borderColor: 'border-rose-100',
      textColor: 'text-slate-900',
      subTextColor: 'text-rose-900/70'
    },
    {
      id: 'dueSoon',
      label: 'Due soon',
      count: dueSoon,
      icon: Clock,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50/70 hover:bg-amber-50',
      borderColor: 'border-amber-100',
      textColor: 'text-slate-900',
      subTextColor: 'text-amber-900/70'
    },
    {
      id: 'blocked',
      label: 'Blocked',
      count: blocked,
      icon: Ban,
      iconColor: 'text-slate-500',
      bgColor: 'bg-slate-50/80 hover:bg-slate-100/70',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-900',
      subTextColor: 'text-slate-600'
    },
    {
      id: 'completed',
      label: 'Completed',
      count: completed,
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/70 hover:bg-emerald-50',
      borderColor: 'border-emerald-100',
      textColor: 'text-slate-900',
      subTextColor: 'text-emerald-900/70'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterClick && onFilterClick(card.id)}
            className={`${card.bgColor} ${card.borderColor} border rounded-2xl p-4 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-3.5`}
          >
            <div className="p-2 rounded-xl bg-white shadow-2xs shrink-0">
              <Icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
                {card.count}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-1">
                {card.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

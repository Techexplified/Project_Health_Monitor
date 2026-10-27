import React from 'react';
import { Info } from 'lucide-react';

export default function WorkloadSignals({
  members = []
}) {
  const displayedMembers = members.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
          Workload signals
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Members with the most overdue work
        </p>
      </div>

      {/* Member rows */}
      <div className="space-y-3">
        {displayedMembers.length === 0 ? (
          <div className="text-xs text-slate-400 py-3 text-center">
            No member workload data available yet.
          </div>
        ) : (
          displayedMembers.map((member) => (
            <div
              key={member.id || member.name}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-full ${member.avatarColor || 'bg-blue-600'} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
                    {member.initials || 'TM'}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {member.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {member.completedCards} of {member.totalCards} completed
                  </div>
                </div>
              </div>

              {/* Overdue badge */}
              {member.overdueCards > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                  {member.overdueCards} overdue
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                  All on track
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info notice box */}
      <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500 leading-relaxed">
        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
        <span>
          Health data is based on cards, due dates, checklists, and labels on this board.
        </span>
      </div>
    </div>
  );
}

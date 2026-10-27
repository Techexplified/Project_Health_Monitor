import React from 'react';
import { X, Calendar, Clock, ExternalLink, AlertTriangle, User } from 'lucide-react';

export default function CardDetailModal({
  card,
  onClose
}) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              card.riskType === 'Overdue'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : card.riskType === 'Due soon'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}>
              {card.riskType}
            </span>
            <span className="text-xs text-slate-400">Card Health Detail</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">
              {card.title}
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Located in list: <span className="font-semibold text-slate-700">{card.listName}</span>
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Due Date:</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {card.dueDate}
              </span>
            </div>

            {card.daysOverdue > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Overdue Duration:</span>
                <span className="font-bold text-rose-600">
                  {card.daysOverdue} {card.daysOverdue === 1 ? 'day' : 'days'} late
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
              <span className="text-slate-500 font-medium">Assigned To:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {card.member?.name || 'Unassigned'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-medium text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>

          {card.url && card.url !== '#' && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
            >
              <span>Open in Trello</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle2, TrendingUp, Lightbulb } from 'lucide-react';

export default function InsightsModal({
  isOpen,
  onClose,
  aiSummary,
  metrics
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                AI Project Insights & Recommendations
              </h3>
              <p className="text-[11px] text-slate-500">
                Automated delivery risk analysis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Main observation */}
          <div className="bg-purple-50/70 border border-purple-200/70 rounded-xl p-3.5 space-y-1">
            <div className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
              <span>{aiSummary?.title || "Delivery risk has increased."}</span>
            </div>
            <p className="text-purple-800/90 leading-relaxed">
              {aiSummary?.body}
            </p>
          </div>

          {/* Action Recommendations */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              <span>Recommended Actions</span>
            </h4>

            <div className="space-y-2">
              {(aiSummary?.recommendations || [
                "Rebalance workload across available assignees to prevent release delays.",
                "Review blocked dependencies in tomorrow's standup.",
                "Check overdue cards and update due dates if milestones shifted."
              ]).map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 text-slate-700"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Metrics Snapshot */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Overdue</div>
              <div className="text-base font-black text-rose-600 mt-0.5">{metrics?.overdue || 0}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Due Soon</div>
              <div className="text-base font-black text-amber-600 mt-0.5">{metrics?.dueSoon || 0}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Completed</div>
              <div className="text-base font-black text-emerald-600 mt-0.5">{metrics?.completed || 0}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

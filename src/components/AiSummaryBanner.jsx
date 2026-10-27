import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

export default function AiSummaryBanner({
  title = "Delivery risk has increased.",
  body = "Four critical cards are overdue and QA is the main bottleneck.",
  onViewInsights
}) {
  return (
    <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50/60 border border-purple-200/80 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-start sm:items-center gap-3">
        {/* Sparkle icon pill */}
        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <Sparkles className="w-4 h-4" />
        </div>

        <div className="text-xs">
          <div className="font-bold text-slate-900 flex items-center gap-2">
            <span>{title}</span>
          </div>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            {body}
          </p>
        </div>
      </div>

      {/* View Insights action */}
      <button
        onClick={onViewInsights}
        className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer self-start sm:self-auto shrink-0 px-2 py-1 rounded-lg hover:bg-purple-100/60"
      >
        <span>View insights</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

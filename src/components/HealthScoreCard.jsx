import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function HealthScoreCard({
  score = 68,
  status = 'AT RISK',
  headline = 'Deadlines need attention',
  impactText = '12 overdue cards may affect the project launch target.'
}) {
  // SVG circular gauge properties
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isAtRisk = score < 70;
  const isModerate = score >= 70 && score < 85;

  const strokeColor = isAtRisk
    ? '#f59e0b' // Amber/orange
    : isModerate
    ? '#3b82f6' // Blue
    : '#10b981'; // Emerald

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-2xs flex items-center gap-5">
      {/* Circular Progress Gauge */}
      <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 96 96">
          {/* Background track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#f1f5f9"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress stroke */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score & label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
            {score}
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            Health score
          </span>
        </div>
      </div>

      {/* Right: Status badge & description */}
      <div className="min-w-0 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          <span>{status}</span>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
          {headline}
        </h2>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {impactText}
        </p>
      </div>
    </div>
  );
}

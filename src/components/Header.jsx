import React from 'react';
import { Calendar, Download, X, Trello, RefreshCw } from 'lucide-react';

export default function Header({
  boardName,
  timeRange,
  setTimeRange,
  onExport,
  onRefresh,
  onClose,
  isRefreshing
}) {
  return (
    <div className="px-6 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
      {/* Left: Logo & Board title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-xs flex items-center justify-center shrink-0">
          <img
            src="/icon.png"
            alt="Project Health Monitor"
            className="w-full h-full object-contain rounded-[10px]"
          />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            Project Health Monitor
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <Trello className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">
              {boardName}
            </span>
            <span>•</span>
            <span>Updated just now</span>
          </div>
        </div>
      </div>

      {/* Right: Controls (Time Range, Export, Refresh, Close) */}
      <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
        {/* Time range selector */}
        <div className="relative inline-flex items-center">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none"
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
          <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
          <div className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">▼</div>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-xs shadow-2xs transition-colors cursor-pointer"
          title="Export health report summary"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export</span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title="Sync board data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-1"
          title="Close Dashboard"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

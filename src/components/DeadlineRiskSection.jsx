import React, { useState } from 'react';
import { Calendar, ChevronRight, Clock, AlertTriangle, Ban } from 'lucide-react';

export default function DeadlineRiskSection({
  cards = [],
  members = [],
  onCardClick
}) {
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter cards
  const filteredCards = cards.filter(card => {
    const matchesMember = selectedMember === 'all' || 
      (card.member && (card.member.name === selectedMember || card.member.id === selectedMember));
    const matchesRisk = selectedRisk === 'all' || card.riskType.toLowerCase().includes(selectedRisk.toLowerCase());
    return matchesMember && matchesRisk;
  });

  const displayedCards = isExpanded ? filteredCards : filteredCards.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Header with Filters */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
            Deadline risk
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Cards that need attention first
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Member Filter */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
              MEMBER
            </span>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All members</option>
              {members.map(m => (
                <option key={m.id || m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
              RISK
            </span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All risks</option>
              <option value="overdue">Overdue</option>
              <option value="due soon">Due soon</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards List */}
      <div className="divide-y divide-slate-100">
        {displayedCards.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No at-risk cards match the selected filter.
          </div>
        ) : (
          displayedCards.map((card) => {
            const isOverdue = card.riskType === 'Overdue';
            const isDueSoon = card.riskType === 'Due soon';
            const isBlocked = card.riskType === 'Blocked';

            const accentBorder = isOverdue
              ? 'border-l-rose-500'
              : isDueSoon
              ? 'border-l-amber-500'
              : 'border-l-slate-400';

            return (
              <div
                key={card.id}
                onClick={() => onCardClick && onCardClick(card)}
                className={`p-4 hover:bg-slate-50/70 border-l-4 ${accentBorder} transition-colors cursor-pointer flex items-center justify-between gap-3 group`}
              >
                {/* Left: Title, list name, member, due date */}
                <div className="min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {card.title}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                    <span className="text-slate-400">in</span>
                    <span className="font-medium text-slate-600">
                      {card.listName}
                    </span>

                    <span>•</span>

                    {/* Member avatar */}
                    <div className="flex items-center gap-1.5">
                      {card.member?.avatar ? (
                        <img
                          src={card.member.avatar}
                          alt=""
                          className="w-4 h-4 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className={`w-4 h-4 rounded-full ${card.member?.avatarColor || 'bg-slate-500'} text-white font-bold text-[8px] flex items-center justify-center shrink-0`}>
                          {card.member?.initials || 'TM'}
                        </div>
                      )}
                      <span className="text-slate-700 font-medium truncate max-w-[100px]">
                        {card.member?.name || 'Unassigned'}
                      </span>
                    </div>

                    <span>•</span>

                    <div className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{card.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Badge, overdue days, chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isOverdue
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : isDueSoon
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {isOverdue && <Clock className="w-2.5 h-2.5" />}
                      {isDueSoon && <Clock className="w-2.5 h-2.5" />}
                      {isBlocked && <Ban className="w-2.5 h-2.5" />}
                      <span>{card.riskType}</span>
                    </span>

                    {isOverdue && (
                      <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                        {card.daysOverdue} {card.daysOverdue === 1 ? 'day' : 'days'} overdue
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer: View all at-risk cards */}
      {filteredCards.length > 4 && (
        <div className="p-3 text-center border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            {isExpanded
              ? 'Show less'
              : `View all ${filteredCards.length} at-risk cards`}
          </button>
        </div>
      )}
    </div>
  );
}

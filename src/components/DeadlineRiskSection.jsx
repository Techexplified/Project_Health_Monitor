import React, { useState, useMemo } from 'react';
import { Calendar, ExternalLink, Clock, AlertTriangle, Ban, RotateCcw } from 'lucide-react';

export default function DeadlineRiskSection({
  cards = [],
  members = [],
  onCardClick
}) {
  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  // Build a comprehensive, deduplicated list of members from both the members prop and card assignments
  const memberList = useMemo(() => {
    const map = new Map();

    // 1. From members prop
    members.forEach(m => {
      const name = (m.name || m.fullName || m.username || '').trim();
      const id = m.id || name;
      if (name && !map.has(name.toLowerCase())) {
        map.set(name.toLowerCase(), {
          id,
          name,
          username: m.username ? m.username.replace(/^@/, '') : ''
        });
      }
    });

    // 2. From cards' assigned members
    cards.forEach(card => {
      if (card.member && card.member.name && card.member.name !== 'Unassigned') {
        const name = card.member.name.trim();
        const id = card.member.id || name;
        if (!map.has(name.toLowerCase())) {
          map.set(name.toLowerCase(), {
            id,
            name,
            username: card.member.username ? card.member.username.replace(/^@/, '') : ''
          });
        }
      }

      if (Array.isArray(card.members)) {
        card.members.forEach(m => {
          const name = (typeof m === 'object' && m ? (m.name || m.fullName || m.username || '') : '').trim();
          const id = (typeof m === 'object' && m ? m.id : name) || name;
          if (name && name !== 'Unassigned' && !map.has(name.toLowerCase())) {
            map.set(name.toLowerCase(), {
              id,
              name,
              username: m.username ? m.username.replace(/^@/, '') : ''
            });
          }
        });
      }
    });

    return Array.from(map.values());
  }, [members, cards]);

  const hasUnassignedCards = useMemo(() => {
    return cards.some(c => !c.memberIds || c.memberIds.length === 0 || c.member?.name === 'Unassigned');
  }, [cards]);

  // Robust filtering logic supporting ID, full name, username, and card assignments
  const filteredCards = cards.filter(card => {
    // 1. Member filter
    let matchesMember = false;
    if (selectedMember === 'all') {
      matchesMember = true;
    } else if (selectedMember === 'unassigned') {
      matchesMember = !card.memberIds || card.memberIds.length === 0 || card.member?.name === 'Unassigned';
    } else {
      const target = selectedMember.toLowerCase().trim();
      const targetUsername = target.replace(/^@/, '');

      // Check primary assigned member
      if (card.member) {
        const mName = (card.member.name || '').toLowerCase().trim();
        const mUser = (card.member.username || '').toLowerCase().replace(/^@/, '').trim();
        const mFull = (card.member.fullName || '').toLowerCase().trim();
        const mId = (card.member.id || '').toLowerCase().trim();

        if (
          mId === target ||
          mName === target ||
          mUser === targetUsername ||
          mFull === target ||
          mName.includes(target) ||
          target.includes(mName)
        ) {
          matchesMember = true;
        }
      }

      // Check memberIds array
      if (!matchesMember && Array.isArray(card.memberIds)) {
        matchesMember = card.memberIds.some(id => {
          if (!id) return false;
          const idStr = String(id).toLowerCase().trim();
          return idStr === target;
        });
      }

      // Check card.members array
      if (!matchesMember && Array.isArray(card.members)) {
        matchesMember = card.members.some(m => {
          if (!m) return false;
          if (typeof m === 'string') {
            const str = m.toLowerCase().trim();
            return str === target || str.includes(target);
          }
          const mName = (m.name || '').toLowerCase().trim();
          const mUser = (m.username || '').toLowerCase().replace(/^@/, '').trim();
          const mFull = (m.fullName || '').toLowerCase().trim();
          const mId = (m.id || '').toLowerCase().trim();

          return (
            mId === target ||
            mName === target ||
            mUser === targetUsername ||
            mFull === target ||
            (mName && mName.includes(target)) ||
            (target && target.includes(mName))
          );
        });
      }

      // Fallback: If card title is named after member (e.g. card titled "sailaja")
      if (!matchesMember && card.title) {
        const titleLower = card.title.toLowerCase().trim();
        if (titleLower === target || titleLower.includes(target) || target.includes(titleLower)) {
          matchesMember = true;
        }
      }
    }

    // 2. Risk filter
    let matchesRisk = false;
    if (selectedRisk === 'all') {
      matchesRisk = true;
    } else {
      const riskTypeLower = (card.riskType || '').toLowerCase();
      const selectedRiskLower = selectedRisk.toLowerCase();
      matchesRisk = riskTypeLower.includes(selectedRiskLower);
    }

    return matchesMember && matchesRisk;
  });

  const displayedCards = isExpanded ? filteredCards : filteredCards.slice(0, 4);

  const resetFilters = () => {
    setSelectedMember('all');
    setSelectedRisk('all');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Header with Filters */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
            Deadline risk
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Cards that need attention first (click to open card in Trello)
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Member Filter */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
              MEMBER
            </span>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All members</option>
              {memberList.map(m => (
                <option key={m.id || m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
              {hasUnassignedCards && (
                <option value="unassigned">Unassigned</option>
              )}
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
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <option value="all">All risks</option>
              <option value="overdue">Overdue</option>
              <option value="due soon">Due soon</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          {/* Clear filters shortcut if a filter is active */}
          {(selectedMember !== 'all' || selectedRisk !== 'all') && (
            <button
              onClick={resetFilters}
              title="Reset filters"
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="divide-y divide-slate-100">
        {displayedCards.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <p className="text-xs text-slate-500 font-medium">
              No at-risk cards match the selected filter ({selectedMember !== 'all' ? selectedMember : ''}{selectedMember !== 'all' && selectedRisk !== 'all' ? ' • ' : ''}{selectedRisk !== 'all' ? selectedRisk : ''}).
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show all at-risk cards</span>
            </button>
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
                title={`Open "${card.title}" on Trello Board`}
                className={`p-4 hover:bg-slate-50/80 border-l-4 ${accentBorder} transition-colors cursor-pointer flex items-center justify-between gap-3 group`}
              >
                {/* Left: Title, list name, member, due date */}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {card.title}
                    </h4>
                    <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>

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
                      <span className="text-slate-700 font-medium truncate max-w-[120px]">
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

                {/* Right: Badge, overdue days, open link icon */}
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

                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
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

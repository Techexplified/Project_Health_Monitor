// Dynamic Health Score & Metrics Calculation Engine

export function computeProjectHealth({ cards = [], lists = [], members = [], filterRange = '30' }) {
  if (!cards || cards.length === 0) {
    return null;
  }

  const listMap = {};
  lists.forEach(l => { listMap[l.id] = l.name; });

  const memberMap = {};
  members.forEach(m => { memberMap[m.id] = m; });

  const now = new Date();
  let overdueCount = 0;
  let dueSoonCount = 0;
  let blockedCount = 0;
  let completedCount = 0;
  let ongoingCount = 0;

  const atRiskCards = [];
  const memberWorkload = {};

  // Initialize workload for each board member
  members.forEach(m => {
    memberWorkload[m.id] = {
      id: m.id,
      name: m.fullName || m.username || 'Member',
      initials: (m.initials || m.fullName?.slice(0, 2) || 'TM').toUpperCase(),
      avatar: m.avatar || m.avatarUrl || null,
      avatarColor: getMemberColor(m.id || m.fullName),
      totalCards: 0,
      completedCards: 0,
      overdueCards: 0
    };
  });

  cards.forEach(card => {
    const listName = (listMap[card.idList] || '').toLowerCase();
    const isCompletedList = listName.includes('done') || listName.includes('complete') || listName.includes('finish');
    const isCompleted = card.dueComplete || isCompletedList;

    const isBlocked = (card.labels && card.labels.some(l => l.name && l.name.toLowerCase().includes('block'))) ||
                      listName.includes('block');

    let isOverdue = false;
    let isDueSoon = false;
    let daysOverdue = 0;

    if (card.due && !isCompleted) {
      const dueDate = new Date(card.due);
      const diffMs = dueDate - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffMs < 0) {
        isOverdue = true;
        daysOverdue = Math.max(1, Math.abs(diffDays));
      } else if (diffDays <= 3) {
        isDueSoon = true;
      }
    }

    if (isCompleted) {
      completedCount++;
    } else if (isOverdue) {
      overdueCount++;
    } else if (isDueSoon) {
      dueSoonCount++;
    } else if (isBlocked) {
      blockedCount++;
    } else {
      ongoingCount++;
    }

    // Assign to members
    const assignedIds = card.idMembers && card.idMembers.length > 0 ? card.idMembers : [];
    assignedIds.forEach(memId => {
      if (memberWorkload[memId]) {
        memberWorkload[memId].totalCards++;
        if (isCompleted) memberWorkload[memId].completedCards++;
        if (isOverdue) memberWorkload[memId].overdueCards++;
      }
    });

    // Populate at-risk list if overdue, due soon, or blocked
    if ((isOverdue || isDueSoon || isBlocked) && !isCompleted) {
      const firstMemberId = assignedIds[0];
      const memberObj = memberWorkload[firstMemberId] || {
        name: 'Unassigned',
        initials: 'UN',
        avatarColor: 'bg-slate-500'
      };

      atRiskCards.push({
        id: card.id,
        title: card.name,
        listName: listMap[card.idList] || 'Card',
        member: memberObj,
        dueDate: card.due ? formatCardDue(card.due) : 'No date',
        daysOverdue,
        riskType: isOverdue ? 'Overdue' : (isDueSoon ? 'Due soon' : 'Blocked'),
        riskSeverity: isOverdue ? (daysOverdue > 2 ? 'critical' : 'high') : (isBlocked ? 'high' : 'medium'),
        url: card.url || '#'
      });
    }
  });

  // Sort at-risk cards: highest overdue first, then blocked, then due soon
  atRiskCards.sort((a, b) => {
    if (a.riskType === 'Overdue' && b.riskType !== 'Overdue') return -1;
    if (b.riskType === 'Overdue' && a.riskType !== 'Overdue') return 1;
    return b.daysOverdue - a.daysOverdue;
  });

  // Calculate Health Score (0 - 100)
  const total = cards.length;
  let score = 100;
  if (total > 0) {
    const overduePenalty = (overdueCount / total) * 60;
    const blockedPenalty = (blockedCount / total) * 30;
    const dueSoonPenalty = (dueSoonCount / total) * 15;
    score = Math.max(15, Math.min(100, Math.round(100 - (overduePenalty + blockedPenalty + dueSoonPenalty))));
  }

  let healthStatus = 'ON TRACK';
  let headline = 'Project velocity is strong';
  let impactText = 'All milestones are on schedule with minimal blockers.';

  if (score < 70) {
    healthStatus = 'AT RISK';
    headline = 'Deadlines need attention';
    impactText = `${overdueCount} overdue cards may affect upcoming delivery targets.`;
  } else if (score < 85) {
    healthStatus = 'MODERATE RISK';
    headline = 'Some items approaching due dates';
    impactText = `${dueSoonCount} cards are due in the next 72 hours.`;
  }

  // Workload array sorted by overdue tasks desc
  const workloadSignals = Object.values(memberWorkload)
    .filter(m => m.totalCards > 0)
    .sort((a, b) => b.overdueCards - a.overdueCards || b.totalCards - a.totalCards);

  // Dynamic AI summary message
  const aiSummary = generateAiSummary({
    score,
    overdueCount,
    blockedCount,
    dueSoonCount,
    workloadSignals,
    atRiskCards
  });

  return {
    metrics: {
      healthScore: score,
      healthStatus,
      headline,
      impactText,
      overdue: overdueCount,
      dueSoon: dueSoonCount,
      blocked: blockedCount,
      completed: completedCount,
      ongoing: ongoingCount,
      totalCards: total,
      completedInPeriod: completedCount
    },
    atRiskCards,
    workloadSignals,
    aiSummary
  };
}

function formatCardDue(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

function getMemberColor(str = '') {
  const colors = [
    'bg-blue-600',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-amber-600',
    'bg-rose-600',
    'bg-indigo-600',
    'bg-teal-600'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function generateAiSummary({ score, overdueCount, blockedCount, workloadSignals, atRiskCards }) {
  if (overdueCount > 0) {
    const topOverdueMember = workloadSignals.find(m => m.overdueCards > 0);
    const memberNote = topOverdueMember ? ` with ${topOverdueMember.name} having ${topOverdueMember.overdueCards} overdue cards` : '';
    return {
      title: score < 70 ? 'Delivery risk has increased.' : 'Minor bottleneck detected.',
      body: `${overdueCount} critical card${overdueCount === 1 ? ' is' : 's are'} overdue${memberNote}. Review priority items before the next milestone.`,
      recommendations: [
        `Triage ${atRiskCards.slice(0, 2).map(c => `"${c.title}"`).join(' and ')} in tomorrow's standup.`,
        'Rebalance workload from team members with multiple overdue assignments.',
        'Review blocked items to clear dependencies early.'
      ]
    };
  }

  if (blockedCount > 0) {
    return {
      title: 'Attention needed on blocked tasks.',
      body: `${blockedCount} card${blockedCount === 1 ? ' is' : 's are'} currently marked as blocked. Unblocking these will keep velocity on track.`,
      recommendations: [
        'Coordinate with cross-functional partners to resolve blocking dependencies.',
        'Tag card assignees for quick status updates.'
      ]
    };
  }

  return {
    title: 'Project health is optimal.',
    body: 'Zero overdue cards detected. Tasks are progressing smoothly according to the board timeline.',
    recommendations: [
      'Maintain current sprint pace and checklist completion rates.',
      'Plan upcoming backlog items for next milestone.'
    ]
  };
}

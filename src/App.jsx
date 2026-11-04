import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HealthScoreCard from './components/HealthScoreCard';
import StatusStatCards from './components/StatusStatCards';
import AiSummaryBanner from './components/AiSummaryBanner';
import DeadlineRiskSection from './components/DeadlineRiskSection';
import TaskStatusBars from './components/TaskStatusBars';
import WorkloadSignals from './components/WorkloadSignals';
import InsightsModal from './components/InsightsModal';
import CardDetailModal from './components/CardDetailModal';

import {
  MOCK_BOARD_NAME,
  MOCK_MEMBERS,
  MOCK_AT_RISK_CARDS,
  MOCK_METRICS,
  MOCK_AI_SUMMARY
} from './data/mockData';

import {
  getTrelloContext,
  waitForTrelloContext,
  autoSize,
  isInsideTrello,
  getBoardData
} from './trelloPowerUp';

import { computeProjectHealth } from './utils/healthCalculator';

export default function App() {
  const [tContext, setTContext] = useState(null);
  const [boardData, setBoardData] = useState(null);
  const [boardName, setBoardName] = useState(MOCK_BOARD_NAME);
  const [timeRange, setTimeRange] = useState('30');
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [atRiskCards, setAtRiskCards] = useState(MOCK_AT_RISK_CARDS);
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [workloadSignals, setWorkloadSignals] = useState(MOCK_MEMBERS);
  const [aiSummary, setAiSummary] = useState(MOCK_AI_SUMMARY);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);

  // Initialize Trello Power-Up context and load real board data
  useEffect(() => {
    let isMounted = true;

    async function init() {
      // Wait for Trello iframe context if inside Trello
      const t = await waitForTrelloContext(3500);
      if (!isMounted) return;

      if (t) {
        setTContext(t);
        autoSize(t);
        await loadBoard(t, timeRange);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update modal height if state changes
  useEffect(() => {
    if (tContext) {
      autoSize(tContext);
    }
  }, [tContext, isInsightsOpen, selectedCard, atRiskCards]);

  // Recalculate health metrics whenever timeRange changes
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    if (boardData) {
      const health = computeProjectHealth({
        cards: boardData.cards || [],
        lists: boardData.lists || [],
        members: boardData.members || [],
        filterRange: newRange
      });

      if (health) {
        setMetrics(health.metrics);
        setAtRiskCards(health.atRiskCards);
        setWorkloadSignals(health.workloadSignals);
        setAiSummary(health.aiSummary);
      }
    }
  };

  const loadBoard = async (t, range = timeRange) => {
    setIsRefreshing(true);
    try {
      const data = await getBoardData(t);
      if (data) {
        setBoardData(data);
        if (data.boardName) {
          setBoardName(data.boardName);
        }
        if (data.members && data.members.length > 0) {
          setMembers(data.members);
        }

        const health = computeProjectHealth({
          cards: data.cards || [],
          lists: data.lists || [],
          members: data.members || [],
          filterRange: range
        });

        if (health) {
          setMetrics(health.metrics);
          setAtRiskCards(health.atRiskCards);
          setWorkloadSignals(health.workloadSignals);
          setAiSummary(health.aiSummary);
        }
      }
    } catch (e) {
      console.warn('Error computing board health from Trello:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    if (tContext) {
      loadBoard(tContext, timeRange);
    } else {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleClose = () => {
    if (tContext && typeof tContext.closeModal === 'function') {
      tContext.closeModal();
    }
  };

  // Redirect to the clicked card on the Trello board
  const handleCardClick = (card) => {
    if (!card) return;

    const cardUrl = card.url && card.url !== '#' 
      ? card.url 
      : (card.shortLink ? `https://trello.com/c/${card.shortLink}` : (card.id ? `https://trello.com/c/${card.id}` : null));

    // 1. If running inside Trello Power-Up context:
    if (tContext) {
      // If valid 24-character Trello card ID, use t.showCard to open directly on the board
      if (typeof tContext.showCard === 'function' && card.id && /^[0-9a-fA-F]{24}$/.test(card.id)) {
        try {
          tContext.showCard(card.id).catch((err) => {
            console.warn('t.showCard failed, navigating via URL:', err);
            if (cardUrl) {
              if (typeof tContext.navigate === 'function') {
                tContext.navigate({ url: cardUrl });
              } else {
                window.open(cardUrl, '_blank');
              }
            }
          });

          // Close modal so Trello cleanly displays the opened card
          if (typeof tContext.closeModal === 'function') {
            tContext.closeModal();
          }
          return;
        } catch (e) {
          console.warn('Error in showCard:', e);
        }
      }

      // If cardUrl is available, navigate parent Trello window or open
      if (cardUrl) {
        if (typeof tContext.navigate === 'function') {
          tContext.navigate({ url: cardUrl });
          if (typeof tContext.closeModal === 'function') {
            tContext.closeModal();
          }
          return;
        } else {
          window.open(cardUrl, '_blank');
          return;
        }
      }
    }

    // 2. Direct browser navigation if outside Trello:
    if (cardUrl) {
      window.open(cardUrl, '_blank');
    } else {
      // Demo card fallback: open detail modal
      setSelectedCard(card);
    }
  };

  const handleExport = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Board Name', boardName],
      ['Health Score', metrics.healthScore],
      ['Status', metrics.healthStatus],
      ['Overdue Tasks', metrics.overdue],
      ['Due Soon Tasks', metrics.dueSoon],
      ['Blocked Tasks', metrics.blocked],
      ['Completed Tasks', metrics.completed],
      ['Total Cards', metrics.totalCards],
      [],
      ['At Risk Card Title', 'List', 'Assignee', 'Due Date', 'Risk Type', 'Days Overdue'],
      ...atRiskCards.map(c => [
        `"${c.title.replace(/"/g, '""')}"`,
        `"${c.listName}"`,
        `"${c.member?.name || 'Unassigned'}"`,
        c.dueDate,
        c.riskType,
        c.daysOverdue
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Project_Health_${boardName.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white w-full flex flex-col antialiased">
      {/* Header */}
      <Header
        boardName={boardName}
        timeRange={timeRange}
        setTimeRange={handleTimeRangeChange}
        onExport={handleExport}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Dashboard Body */}
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-4 flex-1">
        {/* Top Row: Health Score Card (Left) & 4 Status Stat Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* Health Score Card */}
          <div className="lg:col-span-6 flex">
            <div className="w-full">
              <HealthScoreCard
                score={metrics.healthScore}
                status={metrics.healthStatus}
                headline={metrics.headline}
                impactText={metrics.impactText}
              />
            </div>
          </div>

          {/* 4 Status Stat Cards */}
          <div className="lg:col-span-6 flex">
            <div className="w-full">
              <StatusStatCards
                overdue={metrics.overdue}
                dueSoon={metrics.dueSoon}
                blocked={metrics.blocked}
                completed={metrics.completed}
                onFilterClick={(statusId) => {
                  console.log('Filtered by status:', statusId);
                }}
              />
            </div>
          </div>
        </div>

        {/* AI Project Summary Banner */}
        <AiSummaryBanner
          title={aiSummary.title}
          body={aiSummary.body}
          onViewInsights={() => setIsInsightsOpen(true)}
        />

        {/* Lower Two-Column Section: Deadline Risk (Left) & Task Status / Workload (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Deadline Risk */}
          <div className="lg:col-span-7">
            <DeadlineRiskSection
              cards={atRiskCards}
              members={members}
              onCardClick={handleCardClick}
            />
          </div>

          {/* Right Column: Task Status Bars & Workload Signals */}
          <div className="lg:col-span-5 space-y-4">
            <TaskStatusBars
              completed={metrics.completed}
              ongoing={metrics.ongoing}
              overdue={metrics.overdue}
              blocked={metrics.blocked}
              totalCards={metrics.totalCards}
              completedInPeriod={metrics.completedInPeriod}
            />

            <WorkloadSignals
              members={workloadSignals}
            />
          </div>
        </div>
      </div>

      {/* Detail Modals */}
      <InsightsModal
        isOpen={isInsightsOpen}
        onClose={() => setIsInsightsOpen(false)}
        aiSummary={aiSummary}
        metrics={metrics}
      />

      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
}

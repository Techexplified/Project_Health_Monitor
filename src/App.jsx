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
  autoSize,
  isInsideTrello,
  getBoardData
} from './trelloPowerUp';

import { computeProjectHealth } from './utils/healthCalculator';

export default function App() {
  const [tContext, setTContext] = useState(null);
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
    async function init() {
      const t = getTrelloContext();
      if (t) {
        setTContext(t);
        autoSize(t);
        await loadBoard(t);
      }
    }
    init();
  }, []);

  // Update modal height if state changes
  useEffect(() => {
    if (tContext) {
      autoSize(tContext);
    }
  }, [tContext, isInsightsOpen, selectedCard, atRiskCards]);

  const loadBoard = async (t) => {
    setIsRefreshing(true);
    try {
      const data = await getBoardData(t);
      if (data && data.cards && data.cards.length > 0) {
        setBoardName(data.boardName || 'Trello Board');
        setMembers(data.members || []);

        const health = computeProjectHealth({
          cards: data.cards,
          lists: data.lists,
          members: data.members,
          filterRange: timeRange
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
      loadBoard(tContext);
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
    <div className="min-h-screen bg-slate-100/70 p-2 sm:p-5 flex items-center justify-center">
      {/* Main Modal Card matching Figma Wireframe */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in zoom-in-98 duration-150">
        {/* Header */}
        <Header
          boardName={boardName}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          onExport={handleExport}
          onRefresh={handleRefresh}
          onClose={handleClose}
          isRefreshing={isRefreshing}
        />

        {/* Dashboard Body */}
        <div className="p-5 sm:p-6 space-y-4">
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
                onCardClick={(card) => setSelectedCard(card)}
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

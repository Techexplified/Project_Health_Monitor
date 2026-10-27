// Default Mock Data strictly matching the Figma wireframe design for standalone preview & fallback

export const MOCK_BOARD_NAME = "Website Redesign";

export const MOCK_MEMBERS = [
  {
    id: "mem_1",
    name: "Priya Shah",
    initials: "PS",
    avatarColor: "bg-amber-600",
    avatar: null,
    totalCards: 19,
    completedCards: 14,
    overdueCards: 2
  },
  {
    id: "mem_2",
    name: "Nina Okafor",
    initials: "NO",
    avatarColor: "bg-rose-600",
    avatar: null,
    totalCards: 22,
    completedCards: 16,
    overdueCards: 3
  },
  {
    id: "mem_3",
    name: "Maya Chen",
    initials: "MC",
    avatarColor: "bg-purple-600",
    avatar: null,
    totalCards: 15,
    completedCards: 11,
    overdueCards: 2
  },
  {
    id: "mem_4",
    name: "Leo Martins",
    initials: "LM",
    avatarColor: "bg-blue-600",
    avatar: null,
    totalCards: 31,
    completedCards: 22,
    overdueCards: 3
  },
  {
    id: "mem_5",
    name: "Jon Bell",
    initials: "JB",
    avatarColor: "bg-emerald-700",
    avatar: null,
    totalCards: 28,
    completedCards: 17,
    overdueCards: 4
  }
];

export const MOCK_AT_RISK_CARDS = [
  {
    id: "card_1",
    title: "Review analytics tracking plan",
    listName: "In progress",
    member: {
      name: "Priya Shah",
      initials: "PS",
      avatarColor: "bg-amber-600"
    },
    dueDate: "Mar 16",
    daysOverdue: 4,
    riskType: "Overdue",
    riskSeverity: "critical",
    url: "#"
  },
  {
    id: "card_2",
    title: "Approve launch campaign assets",
    listName: "Review",
    member: {
      name: "Nina Okafor",
      initials: "NO",
      avatarColor: "bg-rose-600"
    },
    dueDate: "Mar 17",
    daysOverdue: 3,
    riskType: "Overdue",
    riskSeverity: "critical",
    url: "#"
  },
  {
    id: "card_3",
    title: "Finalize onboarding flow copy",
    listName: "In progress",
    member: {
      name: "Maya Chen",
      initials: "MC",
      avatarColor: "bg-purple-600"
    },
    dueDate: "Mar 18",
    daysOverdue: 2,
    riskType: "Overdue",
    riskSeverity: "high",
    url: "#"
  },
  {
    id: "card_4",
    title: "QA responsive navigation",
    listName: "QA & testing",
    member: {
      name: "Leo Martins",
      initials: "LM",
      avatarColor: "bg-blue-600"
    },
    dueDate: "Mar 19",
    daysOverdue: 1,
    riskType: "Overdue",
    riskSeverity: "high",
    url: "#"
  },
  {
    id: "card_5",
    title: "Update privacy policy for user consent",
    listName: "Backlog",
    member: {
      name: "Jon Bell",
      initials: "JB",
      avatarColor: "bg-emerald-700"
    },
    dueDate: "Mar 20",
    daysOverdue: 0,
    riskType: "Due soon",
    riskSeverity: "medium",
    url: "#"
  },
  {
    id: "card_6",
    title: "Stripe checkout webhook integration",
    listName: "Blocked",
    member: {
      name: "Leo Martins",
      initials: "LM",
      avatarColor: "bg-blue-600"
    },
    dueDate: "Mar 22",
    daysOverdue: 0,
    riskType: "Blocked",
    riskSeverity: "high",
    url: "#"
  }
];

export const MOCK_METRICS = {
  healthScore: 68,
  healthStatus: "AT RISK",
  headline: "Deadlines need attention",
  impactText: "12 overdue cards may affect the Mar 28 launch target.",
  overdue: 12,
  dueSoon: 8,
  blocked: 7,
  completed: 84,
  ongoing: 25,
  totalCards: 128,
  completedInPeriod: 68
};

export const MOCK_AI_SUMMARY = {
  title: "Delivery risk has increased.",
  body: "Four critical cards are overdue and QA is the main bottleneck.",
  recommendations: [
    "Reassign 2 overdue QA cards from Leo Martins to prevent release delays.",
    "Unblock Stripe checkout integration by verifying webhook endpoints.",
    "Conduct daily 5-minute standup on 'In Progress' tasks before March 28 launch."
  ]
};

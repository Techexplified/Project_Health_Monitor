# Project Health Monitor — Trello Power-Up

A comprehensive, real-time **Project Health & Delivery Risk Monitor** built directly for Trello boards.

---

## 🚀 Key Features (Pixel-Perfect from Figma Design)
- **Live Circular Health Score (0-100)**: Instant overall board health score with dynamic risk status (`AT RISK`, `MODERATE RISK`, `ON TRACK`).
- **Real-Time KPI Stat Cards**:
  - 🔴 **Overdue** count and days overdue
  - 🟡 **Due soon** (approaching in 72 hours)
  - ⚪ **Blocked** items
  - 🟢 **Completed** items
- **AI Project Summary**: Dynamic natural-language analysis identifying specific bottleneck lists and team members.
- **Deadline Risk Table**: Filterable by board member and risk type with priority color accents.
- **Task Status Progress Bars**: Proportional visualization of completion vs ongoing and overdue work.
- **Workload Signals**: Identifies team members with the most overdue items to balance workload before sprint milestones.
- **CSV Health Report Export**: One-click export of project health scores, task breakdowns, and at-risk cards.
- **Native Trello Card & Board Badges**: Real-time card badges flagging overdue/blocked tasks directly on the board.

---

## 🛠️ Configuration Details
- **Trello Power-Up Admin:** Configure API Key in Trello Power-Up Admin portal
- **Connector URL:** `https://<your-vercel-domain>/connector.html`
- **Dashboard Modal URL:** `https://<your-vercel-domain>/index.html`

---

## 📦 Tech Stack
- **React 19**
- **Vite 6**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Trello Power-Up Client Library (`power-up.min.js`)**

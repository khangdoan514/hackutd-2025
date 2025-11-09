import React from "react";
import "./Dashboard.css";
import { Activity, Bug, CheckCircle2, TrendingUp, Calendar, Users } from 'lucide-react';

export default function Dashboard() {
  const sprintDaysLeft = 6;
  const sprintProgress = 75;
  const bugsFixed = 24;
  const completionRate = 82;

  const tasks = {
    backlog: [
      { title: "Add dark mode toggle", priority: "Medium", tags: ["UI", "Design"], assignee: "FE" },
      { title: "Fix sign-up redirect", priority: "High", tags: ["Auth"], assignee: "KD" },
    ],
    "in-progress": [
      { title: "Sprint 3 landing page", priority: "Low", tags: ["Frontend"], assignee: "NC" },
      { title: "Database optimization", priority: "High", tags: ["Backend"], assignee: "JM" },
    ],
    done: [
      { title: "API endpoint refactor", priority: "Medium", tags: ["Backend"], assignee: "CW" },
      { title: "Team updates section", priority: "Low", tags: ["UI"], assignee: "FE" },
      { title: "User authentication flow", priority: "High", tags: ["Security"], assignee: "KD" },
    ],
  };

  const teamUpdates = [
    { team: "UI Team", message: "Sprint board redesign completed.", emoji: "🎨", time: "2h ago" },
    { team: "Backend Team", message: "API connection tested successfully.", emoji: "⚡", time: "4h ago" },
    { team: "Frontend Team", message: "Component library update scheduled for next Monday.", emoji: "📦", time: "5h ago" },
    { team: "QA Team", message: "Automated test coverage increased to 87%.", emoji: "🧪", time: "1d ago" },
  ];

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Project Dashboard</h1>
            <p className="subtitle">Sprint 3 — Week 2 Progress</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <Calendar className="btn-icon" />
              View Calendar
            </button>
            <button className="btn-primary">
              <Users className="btn-icon" />
              Team
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <section className="dashboard-stats">
          <div className="metric-card">
            <div className="metric-header">
              <h4>Sprint Progress</h4>

            </div>
            <p className="metric-value">{sprintDaysLeft} Days</p>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${sprintProgress}%` }}
              />
            </div>
            <p className="metric-label">{sprintProgress}% Complete</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4>Bugs Fixed</h4>

            </div>
            <p className="metric-value">{bugsFixed}</p>
            <p className="metric-label">This Sprint</p>
            <span className="tag tag-success">+8 from last week</span>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4>Completion Rate</h4>
]
            </div>
            <p className="metric-value">{completionRate}%</p>
            <p className="metric-label">Tasks Finished</p>
            <span className="tag tag-info">On track</span>
          </div>

        </section>

        {/* Task Board */}
        <section className="board-section">
          <div className="section-header">
            <h2>Sprint Board</h2>
            <div className="board-stats">
              <span className="stat-pill">{tasks.backlog.length} Backlog</span>
              <span className="stat-pill">{tasks["in-progress"].length} In Progress</span>
              <span className="stat-pill">{tasks.done.length} Done</span>
            </div>
          </div>
          <div className="board-scroll">
            {Object.entries(tasks).map(([status, tickets]) => (
              <div key={status} className="board-column" data-status={status}>
                <div className="column-header">
                  <h3>
                    <span className="column-dot" />
                    {status.replace("-", " ").toUpperCase()}
                  </h3>
                  <span className="column-count">{tickets.length}</span>
                </div>
                <div className="column-body">
                  {tickets.map((t, i) => (
                    <div key={i} className="ticket-card">
                      <div className="ticket-meta">
                        <span
                          className={`priority-tag priority-${t.priority.toLowerCase()}`}
                        >
                          {t.priority}
                        </span>
                        <span className="assignee-badge">{t.assignee}</span>
                      </div>
                      <p className="ticket-title">{t.title}</p>
                      <div className="ticket-tags">
                        {t.tags.map((tag, j) => (
                          <span key={j} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🗞️ Team Updates */}
        <section className="team-updates">
          <div className="team-updates-header">
            <h3>Team Updates</h3>
            <span className="update-date">Nov 9, 2025</span>
          </div>

          <div className="updates-list">
            {teamUpdates.map((update, index) => (
              <div key={index} className="update-card">
                <div className="update-content">
                  <p>
                    <strong>{update.team}:</strong> {update.message}
                  </p>
                  <span className="update-time">{update.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
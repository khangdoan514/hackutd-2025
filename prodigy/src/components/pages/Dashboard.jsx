import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const sprintDaysLeft = 6;
  const sprintProgress = 75;
  const bugsFixed = 24;

  const tasks = {
    backlog: [
      { title: "Add dark mode toggle", priority: "Medium", tags: ["UI", "Design"], assignee: "FE" },
      { title: "Fix sign-up redirect", priority: "High", tags: ["Auth"], assignee: "KD" },
    ],
    "in-progress": [
      { title: "Sprint 3 landing page", priority: "Low", tags: ["Frontend"], assignee: "NC" },
    ],
    done: [
      { title: "API endpoint refactor", priority: "Medium", tags: ["Backend"], assignee: "CW" },
      { title: "Team updates section", priority: "Low", tags: ["UI"], assignee: "FE" },
    ],
  };

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Project Dashboard</h1>
            <p className="subtitle">Sprint 3 — Week 2 Progress</p>
          </div>
        </header>

        {/* 📊 Metric Cards */}
        <section className="dashboard-stats">
          <div className="metric-card">
            <div className="metric-header">
              <h4>Sprint Progress</h4>            </div>
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
              <h4>Bugs Fixed</h4>            </div>
            <p className="metric-value">{bugsFixed}</p>
            <p className="metric-label">This Sprint</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h4>Completion Rate</h4>
            </div>
            <p className="metric-value">82%</p>
            <p className="metric-label">Tasks Finished</p>
          </div>
        </section>

        {}
        <section className="board-scroll">
          {Object.entries(tasks).map(([status, tickets]) => (
            <div key={status} className="board-column" data-status={status}>
              <div className="column-header">
                <h3>
                  <span className="column-dot" />{" "}
                  {status.replace("-", " ").toUpperCase()}
                </h3>
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
                      <span className="muted">{t.assignee}</span>
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
        </section>

        {/* 🗞️ Team Updates */}
        <section className="team-updates">
  <div className="team-updates-header">
    <h3>Team Updates</h3>
    <span className="update-date">Nov 9, 2025</span>
  </div>

  <div className="updates-list">
    <div className="update-card">
      <p><strong>UI Team:</strong> Sprint board redesign completed.</p>
    </div>
    <div className="update-card">
      <p><strong>Backend Team:</strong> API connection tested successfully.</p>
    </div>
    <div className="update-card">
      <p><strong>Frontend Team:</strong> Scheduled for next Monday.</p>
    </div>
  </div>
</section>

      </main>
    </div>
  );
}

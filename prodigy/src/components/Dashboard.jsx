import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const navShortcuts = [
  { label: "Board", active: true },
  { label: "Timeline" },
  { label: "Backlog" },
  { label: "Reports" },
];

const metrics = [
  {
    label: "Active sprints",
    value: "2",
    detail: "Atlas closes in 5 days",
  },
  {
    label: "Issues in progress",
    value: "18",
    detail: "+3 vs last sprint",
  },
  {
    label: "Blocked items",
    value: "4",
    detail: "Escalated to platform team",
  },
];

const boardColumns = [
  {
    id: "backlog",
    title: "Backlog",
    description: "Research, ideation, and intake",
    accent: "#8f6bff",
    tickets: [
      {
        key: "PRD-120",
        title: "Admin analytics: define KPIs for rollout",
        tags: ["Discovery", "Analytics"],
        owner: "AL",
        priority: "low",
      },
      {
        key: "PRD-118",
        title: "AI summarizer spike for standups",
        tags: ["Experiment"],
        owner: "KT",
        priority: "medium",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    description: "Engineering focus this sprint",
    accent: "#4f8cff",
    tickets: [
      {
        key: "PRD-105",
        title: "Unified search experience on workspace",
        tags: ["Frontend", "Search"],
        owner: "JS",
        priority: "high",
      },
      {
        key: "PRD-101",
        title: "Role based access patches",
        tags: ["Platform"],
        owner: "MP",
        priority: "medium",
      },
      {
        key: "PRD-099",
        title: "Performance guardrails for dashboards",
        tags: ["Performance"],
        owner: "CV",
        priority: "medium",
      },
    ],
  },
  {
    id: "qa",
    title: "Review & QA",
    description: "Ready for demo or verification",
    accent: "#44d4a8",
    tickets: [
      {
        key: "PRD-094",
        title: "Notifications: batched delivery",
        tags: ["Backend"],
        owner: "SR",
        priority: "medium",
      },
      {
        key: "PRD-090",
        title: "Billing insights empty state",
        tags: ["Design"],
        owner: "MC",
        priority: "low",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    description: "Shipped to production",
    accent: "#f5c451",
    tickets: [
      {
        key: "PRD-086",
        title: "Security posture dashboard",
        tags: ["Security"],
        owner: "YL",
        priority: "high",
      },
      {
        key: "PRD-083",
        title: "Partner workspace templates",
        tags: ["Growth"],
        owner: "TN",
        priority: "medium",
      },
    ],
  },
];

const priorityCopy = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const Dashboard = () => {
  const [updates, setUpdates] = useState([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUpdates = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/message");
        if (!isMounted) return;
        const payload = Array.isArray(response.data?.message)
          ? response.data.message
          : [];
        setUpdates(payload);
      } catch (error) {
        if (isMounted) {
          setUpdates([]);
        }
      } finally {
        if (isMounted) {
          setLoadingUpdates(false);
        }
      }
    };

    loadUpdates();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">P</span>
          <div>
            <p className="logo-eyebrow">Prodigy</p>
            <p className="logo-title">Team Workspace</p>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="section-label">Navigation</p>
          <nav className="sidebar-nav">
            {navShortcuts.map((item) => (
              <button
                key={item.label}
                className={`nav-link ${item.active ? "is-active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="sidebar-section">
          <p className="section-label">Workload</p>
          <div className="sidebar-progress">
            <div className="progress-ring">
              <span>72%</span>
            </div>
            <div>
              <p className="progress-title">Sprint capacity</p>
              <p className="progress-subtitle">9 of 12 contributors active</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Sprint // Atlas</p>
            <h1>Prodigy Collaboration Board</h1>
            <p className="subtitle">
              Keep priorities aligned across product, design, and engineering.
            </p>
          </div>
          <div className="header-actions">
            <button className="ghost-button">Quick search</button>
            <button className="primary-button">New issue</button>
          </div>
        </header>

        <section className="dashboard-stats">
          {metrics.map((metric) => (
            <article key={metric.label} className="metric-card">
              <p className="metric-label">{metric.label}</p>
              <p className="metric-value">{metric.value}</p>
              <p className="metric-detail">{metric.detail}</p>
            </article>
          ))}
        </section>

        <section className="dashboard-body">
          <div className="board-scroll">
            {boardColumns.map((column) => (
              <div key={column.id} className="board-column">
                <div className="column-header">
                  <div>
                    <p className="column-title">{column.title}</p>
                    <p className="column-description">{column.description}</p>
                  </div>
                  <span
                    className="column-dot"
                    style={{ backgroundColor: column.accent }}
                    aria-hidden
                  />
                </div>

                <div className="column-body">
                  {column.tickets.map((ticket) => (
                    <article key={ticket.key} className="ticket-card">
                      <div className="ticket-meta">
                        <span className="ticket-key">{ticket.key}</span>
                        <span
                          className={`priority-tag priority-${ticket.priority}`}
                        >
                          {priorityCopy[ticket.priority]}
                        </span>
                      </div>
                      <p className="ticket-title">{ticket.title}</p>
                      <div className="ticket-tags">
                        {ticket.tags.map((tag) => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="ticket-footer">
                        <span className="avatar">{ticket.owner}</span>
                        <button className="ghost-button small">Handoff</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <aside className="insights-panel">
            <div className="panel-block">
              <div className="panel-header">
                <div>
                  <p className="panel-title">Team updates</p>
                  <p className="panel-subtitle">Live feed from workspace API</p>
                </div>
                <span className="status-pill">Live</span>
              </div>

              <div className="panel-body">
                {loadingUpdates && <p className="muted">Loading updates…</p>}
                {!loadingUpdates && updates.length === 0 && (
                  <p className="muted">No updates yet.</p>
                )}
                {!loadingUpdates && updates.length > 0 && (
                  <ul className="updates-list">
                    {updates.map((message, index) => (
                      <li key={`${message}-${index}`}>
                        <p>{message}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="panel-block capacity">
              <p className="panel-title">Capacity planning</p>
              <ul>
                <li>
                  <span>Frontend guild</span>
                  <strong>85%</strong>
                </li>
                <li>
                  <span>Platform guild</span>
                  <strong>68%</strong>
                </li>
                <li>
                  <span>Customer success</span>
                  <strong>54%</strong>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

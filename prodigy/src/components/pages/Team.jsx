import React, { useMemo, useState } from "react";
import "./Team.css";


/**
 * PMBlackPurpleHub.jsx
 * --------------------------------------------------
 * A dark (black & purple) product management hub inspired by the screenshot:
 * - Overall Progress gauge (conic-gradient semi-donut)
 * - Mini calendar (current month, simple nav)
 * - Team members list with online badge + Message button
 * - Deadlines list with quick "Complete" action
 * - Create Poll button
 * 
 * All data is mock; swap with your API.
 */

export default function PMBlackPurpleHub() {
  // -------- Mock Data --------
  const progress = 72; // overall percent
  const team = useMemo(
    () => [
      { id: "u1", name: "Frabina E.", online: true, initials: "FE" },
      { id: "u2", name: "Fred E.", online: true, initials: "FE" },
      { id: "u3", name: "Evan S.", online: true, initials: "ES" },
      { id: "u4", name: "Fahim H.", online: false, initials: "FH" },
      { id: "u5", name: "Hasti P.", online: false, initials: "HP" },
      { id: "u6", name: "Henry N.", online: false, initials: "HN" },
      { id: "u7", name: "Frabina E.", online: true, initials: "FE" },
      { id: "u8", name: "Henry N.", online: false, initials: "HN" },
      { id: "u9", name: "Evan S.", online: true, initials: "ES" },
    ],
    []
  );

  const [deadlines, setDeadlines] = useState([
    { id: "d1", title: "this due", hoursLeft: 3, status: "due" },
    { id: "d2", title: "this due", hoursLeft: 10, status: "due" },
  ]);

  function completeDeadline(id) {
    setDeadlines((prev) => prev.map((d) => (d.id === id ? { ...d, status: "done" } : d)));
  }

  // -------- Calendar helpers --------
  const today = new Date();
  const [activeDate, setActiveDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const { monthName, daysGrid } = useMemo(() => {
    const m = activeDate.getMonth();
    const y = activeDate.getFullYear();
    const monthName = activeDate.toLocaleString(undefined, { month: "long", year: "numeric" });

    const first = new Date(y, m, 1);
    const startDay = (first.getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevMonthDays = new Date(y, m, 0).getDate();

    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push({ key: "p" + i, day: prevMonthDays - (startDay - 1 - i), faded: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
      cells.push({ key: "d" + d, day: d, today: isToday });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ key: "n" + cells.length, day: cells.length % 30 || 30, faded: true });
    }
    while (cells.length < 42) cells.push({ key: "x" + cells.length, day: (cells.length % 30) + 1, faded: true });
    return { monthName, daysGrid: cells };
  }, [activeDate]);

  function addMonths(n) {
    const d = new Date(activeDate);
    d.setMonth(d.getMonth() + n);
    setActiveDate(d);
  }

  const gaugeDeg = progress * 1.8; // 0..180

  return (
    <div className="pp-shell">
      {/* Top row: Big note / announcements box */}
      <section className="pp-note card">
        <div className="pp-noteHeader">
          <h3>Project Brief</h3>
          <button className="btn ghost">Edit</button>
        </div>
        <p className="muted">Use this space for quick updates, links, or sprint context.</p>
      </section>

      {/* Progress card */}
      <section className="pp-progress card">
        <header className="pp-cardHeader">
          <div>
            <div className="eyebrow">Overall Progress</div>
            <div className="meta">tasks completed vs total</div>
          </div>
          <div><button className="btn pill">All ▾</button></div>
        </header>

        <div className="gauge">
          <div
            className="gauge-arc"
            style={{ 
              background: `conic-gradient(var(--accent) ${gaugeDeg}deg, var(--track) ${gaugeDeg}deg 180deg)` 
            }}
          />
          <div className="gauge-center">
            <div className="pct">{progress}%</div>
            <div className="sub muted">Completed</div>
          </div>
          <div className="gauge-ticks">
            <span>0</span><span>50</span><span>100</span>
          </div>
        </div>
      </section>

      {/* Calendar card */}
      <section className="pp-calendar card">
        <header className="pp-cardHeader">
          <div className="eyebrow">{monthName}</div>
          <div className="calendar-nav">
            <button className="btn icon" onClick={() => addMonths(-1)}>‹</button>
            <button className="btn icon" onClick={() => addMonths(1)}>›</button>
          </div>
        </header>

        <div className="cal-grid">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
            <div key={d} className="cal-dow muted">{d}</div>
          ))}
          {daysGrid.map((c) => (
            <div key={c.key} className={`cal-cell ${c.faded ? "faded" : ""} ${c.today ? "today" : ""}`}>
              {c.day}
            </div>
          ))}
        </div>
      </section>

      {/* Team members list */}
      <aside className="pp-team card">
        <header className="pp-teamHeader">
          <h3>Team Members</h3>
          <button className="btn icon">＋</button>
        </header>
        <ul className="team-list">
          {team.map((t) => (
            <li key={t.id} className="team-row">
              <div className="avatar">{t.initials}</div>
              <div className="tmeta">
                <div className="tname">{t.name}</div>
                <div className={`badge ${t.online ? "online" : "offline"}`}>{t.online ? "online" : "offline"}</div>
              </div>
              <button className="btn ghost small">Message</button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Deadlines header + Create Poll */}
      <div className="pp-deadlineHdr">
        <div className="eyebrow">Deadlines</div>
        <button className="btn pill">＋ Create Poll</button>
      </div>

      {/* Deadlines list */}
      <section className="pp-deadlines card">
        <ul className="deadline-list">
          {deadlines.map((d) => (
            <li key={d.id} className={`deadline-row ${d.status === "done" ? "is-done" : ""}`}>
              <div className="d-title">
                <div className="eyebrow">{d.title}</div>
                <div className="muted">{d.hoursLeft} hours</div>
              </div>
              <button
                className="btn subtle"
                onClick={() => completeDeadline(d.id)}
                disabled={d.status === "done"}
              >
                {d.status === "done" ? "Completed" : "Complete"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

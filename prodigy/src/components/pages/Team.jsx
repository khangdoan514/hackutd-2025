import React, { useMemo, useState } from "react";
import "./Team.css";

/**
 * PMBlackPurpleHub.jsx
 * --------------------------------------------------
 * Black & purple PM hub with:
 * - Overall Progress gauge
 * - Calendar with **red sprint highlighting** (current sprint window)
 * - Team members list
 * - Deadlines list with Complete
 * - Create Poll button
 *
 * Change the sprint config below to match your cadence.
 */

export default function PMBlackPurpleHub() {
  // ----------- Sprint config -----------
  // Anchor: the start of your sprint cycle (e.g., a Monday when the cycle began).
  const sprintAnchor = new Date(2025, 0, 6); // Jan 6, 2025 (Monday) — change as needed
  const sprintLengthDays = 14;               // typical two‑week sprint
  // Which sprint window to color? "current" colors only the sprint that contains 'today'.
  // You can switch to "rolling" to color the sprint that intersects the visible month.
  const sprintMode = "current"; // "current" | "rolling"

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
  const today = stripTime(new Date());
  const [activeDate, setActiveDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Compute the sprint window to highlight
  const { currentSprintStart, currentSprintEnd } = useMemo(() => {
    const { start, end } = sprintWindowForDate(sprintAnchor, sprintLengthDays, today);
    return { currentSprintStart: start, currentSprintEnd: end };
  }, [sprintAnchor, sprintLengthDays, today]);

  const { monthName, daysGrid } = useMemo(() => {
    const m = activeDate.getMonth();
    const y = activeDate.getFullYear();
    const monthName = activeDate.toLocaleString(undefined, { month: "long", year: "numeric" });

    const first = new Date(y, m, 1);
    const startDay = (first.getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const prevMonthDays = new Date(y, m, 0).getDate();

    const cells = [];

    // Decide which sprint window to display for coloring
    let sprintStart = currentSprintStart;
    let sprintEnd = currentSprintEnd;
    if (sprintMode === "rolling") {
      // choose sprint window that overlaps the visible first-of-month
      const visRef = stripTime(new Date(y, m, 1));
      const w = sprintWindowForDate(sprintAnchor, sprintLengthDays, visRef);
      sprintStart = w.start; sprintEnd = w.end;
    }

    // leading cells (previous month)
    for (let i = 0; i < startDay; i++) {
      const day = prevMonthDays - (startDay - 1 - i);
      const date = stripTime(new Date(y, m - 1, day));
      cells.push({ key: "p" + i, date, day, faded: true, today: isSameDate(date, today), sprint: inRange(date, sprintStart, sprintEnd) });
    }
    // month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = stripTime(new Date(y, m, d));
      cells.push({ key: "d" + d, date, day: d, today: isSameDate(date, today), sprint: inRange(date, sprintStart, sprintEnd) });
    }
    // trailing to fill to end of week
    while (cells.length % 7 !== 0) {
      const idx = cells.length;
      const day = (idx % 31) + 1;
      const date = stripTime(new Date(y, m + 1, day));
      cells.push({ key: "n" + idx, date, day, faded: true, today: isSameDate(date, today), sprint: inRange(date, sprintStart, sprintEnd) });
    }
    // ensure 6 rows (42 cells)
    while (cells.length < 42) {
      const idx = cells.length;
      const day = (idx % 31) + 1;
      const date = stripTime(new Date(y, m + 1, day));
      cells.push({ key: "x" + idx, date, day, faded: true, today: isSameDate(date, today), sprint: inRange(date, sprintStart, sprintEnd) });
    }

    return { monthName, daysGrid: cells };
  }, [activeDate, currentSprintStart, currentSprintEnd, sprintAnchor, sprintLengthDays, sprintMode, today]);

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
            <div
              key={c.key}
              className={`cal-cell ${c.faded ? "faded" : ""} ${c.today ? "today" : ""} ${c.sprint ? "sprint" : ""}`}
              title={c.date.toDateString()}
            >
              {c.day}
            </div>
          ))}
        </div>
        <div className="legend">
          <span className="legend-chip sprint" /> Sprint window
          <span className="legend-chip today" /> Today
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

/* ===== Date helpers / sprint logic ===== */
function stripTime(d){
  const x = new Date(d);
  x.setHours(0,0,0,0);
  return x;
}
function diffDays(a,b){
  const ms = stripTime(a).getTime() - stripTime(b).getTime();
  return Math.round(ms/86400000);
}
function isSameDate(a,b){ return stripTime(a).getTime() === stripTime(b).getTime(); }
function inRange(d, start, end){ return stripTime(d) >= stripTime(start) && stripTime(d) <= stripTime(end); }

/** Returns {start, end} sprint window for a reference date. */
function sprintWindowForDate(anchor, lengthDays, refDate){
  const a = stripTime(anchor);
  const r = stripTime(refDate);
  const daysSinceAnchor = diffDays(r, a);
  const cycles = Math.floor(daysSinceAnchor / lengthDays);
  const start = new Date(a);
  start.setDate(a.getDate() + cycles * lengthDays);
  const end = new Date(start);
  end.setDate(start.getDate() + lengthDays - 1);
  return { start: stripTime(start), end: stripTime(end) };
}

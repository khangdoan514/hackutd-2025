import { useMemo, useState } from "react";
import "./Calendar.css";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const taskSeed = [
  {
    id: "task-01",
    date: "2025-11-07",
    title: "Sprint planning sync",
    time: "09:00 AM",
    owner: "Product",
    status: "due-soon",
    category: "Meeting",
  },
  {
    id: "task-02",
    date: "2025-11-08",
    title: "Design review: onboarding journey",
    time: "01:30 PM",
    owner: "Design",
    status: "planned",
    category: "Review",
  },
  {
    id: "task-03",
    date: "2025-11-09",
    title: "Ship notification service fixes",
    time: "04:00 PM",
    owner: "Platform",
    status: "at-risk",
    category: "Delivery",
  },
  {
    id: "task-04",
    date: "2025-11-10",
    title: "QA sweep for dashboard release",
    time: "11:00 AM",
    owner: "QA",
    status: "planned",
    category: "QA",
  },
  {
    id: "task-05",
    date: "2025-11-10",
    title: "Customer beta feedback session",
    time: "02:00 PM",
    owner: "Research",
    status: "planned",
    category: "Customer",
  },
  {
    id: "task-06",
    date: "2025-11-12",
    title: "Publish sprint demo recording",
    time: "05:30 PM",
    owner: "Marketing",
    status: "completed",
    category: "Content",
  },
  {
    id: "task-07",
    date: "2025-11-13",
    title: "Security posture review",
    time: "10:30 AM",
    owner: "Security",
    status: "due-soon",
    category: "Audit",
  },
];

const statusCopy = {
  "due-soon": "Due soon",
  planned: "Planned",
  "at-risk": "At risk",
  completed: "Completed",
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildCalendarGrid = (month) => {
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  return Array.from({ length: 42 }).map((_, idx) => {
    const day = new Date(calendarStart);
    day.setDate(calendarStart.getDate() + idx);
    return day;
  });
};

const Calendar = () => {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const tasksByDate = useMemo(() => {
    return taskSeed.reduce((result, task) => {
      if (!result[task.date]) {
        result[task.date] = [];
      }
      result[task.date].push(task);
      return result;
    }, {});
  }, []);

  const daysInView = useMemo(
    () => buildCalendarGrid(currentMonth),
    [currentMonth]
  );

  const selectedKey = formatDateKey(selectedDate);
  const selectedTasks = tasksByDate[selectedKey] || [];

  const upcomingTasks = useMemo(() => {
    const todayKey = formatDateKey(today);
    return taskSeed
      .filter((task) => task.date >= todayKey)
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, 4);
  }, [today]);

  const handleMonthChange = (offset) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + offset);
      return next;
    });
  };

  const handleDaySelect = (day) => {
    setSelectedDate(new Date(day));
  };

  const monthLabel = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <div>
          <p className="eyebrow">Sprint // Atlas</p>
          <h1>Schedule</h1>
          <p className="muted">
            Track milestone owners and see what is landing on each day.
          </p>
        </div>

        <div className="calendar-controls">
          <button
            type="button"
            className="ghost-button"
            onClick={() => handleMonthChange(-1)}
          >
            ← Prev
          </button>
          <span className="month-label">{monthLabel}</span>
          <button
            type="button"
            className="ghost-button"
            onClick={() => handleMonthChange(1)}
          >
            Next →
          </button>
        </div>
      </header>

      <section className="calendar-shell">
        <div className="calendar-grid-wrapper">
          <div className="calendar-grid">
            {dayNames.map((name) => (
              <p key={name} className="day-name">
                {name}
              </p>
            ))}

            {daysInView.map((day) => {
              const key = formatDateKey(day);
              const tasksForDay = tasksByDate[key] || [];
              const isOutside =
                day.getMonth() !== currentMonth.getMonth() ||
                day.getFullYear() !== currentMonth.getFullYear();
              const isToday = formatDateKey(today) === key;

              const dayClasses = [
                "calendar-day",
                isOutside && "outside-month",
                isToday && "today",
                selectedKey === key && "selected",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  type="button"
                  key={key}
                  className={dayClasses}
                  onClick={() => handleDaySelect(day)}
                >
                  <span className="day-number">{day.getDate()}</span>
                  {tasksForDay.length > 0 && (
                    <span className="task-count">
                      {tasksForDay.length} task
                      {tasksForDay.length > 1 ? "s" : ""}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="calendar-sidebar">
          <div className="tasks-card">
            <div className="tasks-card-header">
              <div>
                <p className="panel-title">Day breakdown</p>
                <p className="muted">{selectedKey}</p>
              </div>
              <span className="status-pill neutral">
                {selectedTasks.length} scheduled
              </span>
            </div>

            <div className="tasks-list">
              {selectedTasks.length === 0 && (
                <p className="empty-state">
                  Nothing on the books for this day. Add a task from the board.
                </p>
              )}

              {selectedTasks.map((task) => (
                <article key={task.id} className="task-row">
                  <div>
                    <p className="task-title">{task.title}</p>
                    <p className="task-meta">
                      {task.time} • {task.owner} • {task.category}
                    </p>
                  </div>
                  <span className={`status-pill ${task.status}`}>
                    {statusCopy[task.status]}
                  </span>
                </article>
              ))}
            </div>
          </div>

          <div className="tasks-card compact">
            <p className="panel-title">Upcoming focus</p>
            <ul className="upcoming-list">
              {upcomingTasks.map((task) => (
                <li key={`upcoming-${task.id}`}>
                  <div>
                    <p className="task-title">{task.title}</p>
                    <p className="task-meta">
                      {task.date} • {task.time}
                    </p>
                  </div>
                  <span className={`status-dot ${task.status}`} />
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Calendar;

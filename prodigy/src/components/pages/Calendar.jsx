import { useMemo, useState } from "react";
import "./Calendar.css";
import { ChevronLeft, ChevronRight, Plus, Sparkles, Clock, User, Tag, AlertCircle } from 'lucide-react';

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
    priority: "high",
  },
  {
    id: "task-02",
    date: "2025-11-08",
    title: "Design review: onboarding journey",
    time: "01:30 PM",
    owner: "Design",
    status: "planned",
    category: "Review",
    priority: "medium",
  },
  {
    id: "task-03",
    date: "2025-11-09",
    title: "Work on AI Integration",
    time: "04:00 PM",
    owner: "Platform",
    status: "at-risk",
    category: "Deliverable",
    priority: "high",
  },
  {
    id: "task-04",
    date: "2025-11-10",
    title: "Dashboard release",
    time: "11:00 AM",
    owner: "QA",
    status: "planned",
    category: "QA",
    priority: "medium",
  },
  {
    id: "task-05",
    date: "2025-11-10",
    title: "Redo front-end",
    time: "02:00 PM",
    owner: "Research",
    status: "planned",
    category: "Customer",
    priority: "low",
  },
  {
    id: "task-06",
    date: "2025-11-12",
    title: "Progress Update",
    time: "05:30 PM",
    owner: "Marketing",
    status: "completed",
    category: "Content",
    priority: "low",
  },
  {
    id: "task-07",
    date: "2025-11-13",
    title: "Content Review",
    time: "10:30 AM",
    owner: "Security",
    status: "due-soon",
    category: "Audit",
    priority: "high",
  },
  {
    id: "task-08",
    date: "2025-11-15",
    title: "Team retrospective",
    time: "03:00 PM",
    owner: "Product",
    status: "planned",
    category: "Meeting",
    priority: "medium",
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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFocus, setAiFocus] = useState("");

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
      .slice(0, 5);
  }, [today]);

  const handleGenerateAIFocus = async () => {
    setAiLoading(true);
    setAiFocus("");

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{
            role: 'user',
            content: `You are a productivity AI assistant helping a team manage their schedule. Analyze the following tasks for ${selectedKey}:

${selectedTasks.length > 0 ? selectedTasks.map(t => `• ${t.title}
  Time: ${t.time}
  Owner: ${t.owner}
  Priority: ${t.priority}
  Status: ${t.status}
  Category: ${t.category}`).join('\n\n') : 'No tasks scheduled'}

Provide a concise daily focus guide:

Daily Focus: (One clear sentence about what matters most today)

Prioritization:
- (Top priority task and why)
- (Second focus area)
- (Any time-sensitive items)

Insights:
- (Any scheduling conflicts or suggestions)
- (Recommended approach for the day)

Keep it brief, actionable, and friendly.`
          }]
        })
      });

      if (!response.ok) throw new Error(`API request failed: ${response.status}`);

      const data = await response.json();
      
      let text = '';
      if (data.content && Array.isArray(data.content)) {
        text = data.content
          .filter(item => item.type === 'text')
          .map(item => item.text)
          .join('\n');
      }
      
      if (!text) throw new Error('No response text received');
      
      setAiFocus(text);
    } catch (error) {
      console.error('AI Error:', error);
      setAiFocus('Error generating focus. Please check your connection and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleMonthChange = (offset) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + offset);
      return next;
    });
  };

  const handleDaySelect = (day) => {
    setSelectedDate(new Date(day));
    setAiFocus("");
  };

  const monthLabel = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const tasksCompletedThisWeek = taskSeed.filter(t => {
    const taskDate = new Date(t.date);
    return t.status === 'completed' && taskDate >= startOfWeek && taskDate <= endOfWeek;
  }).length;

  const highPriorityTasks = taskSeed.filter(t => t.priority === 'high').length;
  const upcomingDeadlines = taskSeed.filter(t => new Date(t.date) >= today).length;

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <div>
          <p className="eyebrow">Planning</p>
          <h1>Schedule & Calendar</h1>
          <p className="subtitle">Manage your team's timeline and deliverables</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn-secondary">
            <Plus />
            Add Event
          </button>
        </div>
      </header>

      <div className="calendar-controls-bar">
        <div className="calendar-nav">
          <button type="button" className="nav-button" onClick={() => handleMonthChange(-1)}>
            <ChevronLeft />
          </button>
          <span className="month-label">{monthLabel}</span>
          <button type="button" className="nav-button" onClick={() => handleMonthChange(1)}>
            <ChevronRight />
          </button>
        </div>
        <button
          type="button"
          className="btn-today"
          onClick={() => {
            setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
            setSelectedDate(today);
          }}
        >
          Today
        </button>
      </div>

      <section className="calendar-shell">
        <div className="calendar-grid-wrapper">
          <div className="calendar-weekdays">
            {dayNames.map((name) => (
              <div key={name} className="day-name">{name}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {daysInView.map((day) => {
              const key = formatDateKey(day);
              const tasksForDay = tasksByDate[key] || [];
              const isOutside = day.getMonth() !== currentMonth.getMonth() || day.getFullYear() !== currentMonth.getFullYear();
              const isToday = formatDateKey(today) === key;
              const isSelected = selectedKey === key;

              const dayClasses = [
                "calendar-day",
                isOutside && "outside-month",
                isToday && "today",
                isSelected && "selected",
              ].filter(Boolean).join(" ");

              return (
                <button
                  type="button"
                  key={key}
                  className={dayClasses}
                  onClick={() => handleDaySelect(day)}
                >
                  <span className="day-number">{day.getDate()}</span>
                  <div className="day-tasks">
                    {tasksForDay.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`task-dot priority-${task.priority}`}
                        title={task.title}
                      >
                        <span className="task-indicator"></span>
                      </div>
                    ))}
                    {tasksForDay.length > 3 && (
                      <span className="more-tasks">+{tasksForDay.length - 3}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {}
          <div className="tasks-card highlights-card">
            <h3 className="panel-title">Overview</h3>
            <ul className="highlights-list">
              <li>Tasks Completed This Week: {tasksCompletedThisWeek}</li>
              <li>High-Priority Tasks: {highPriorityTasks}</li>
              <li>Upcoming Deadlines: {upcomingDeadlines}</li>
            </ul>
          </div>
        </div>

        <aside className="calendar-sidebar">
          {}
          <div className="ai-focus-card">
            <div className="ai-focus-header">
              <div className="ai-focus-title">
                <Sparkles className="sparkle-icon" />
                <h3>AI Daily Focus</h3>
              </div>
              <button
                className="btn-generate"
                onClick={handleGenerateAIFocus}
                disabled={aiLoading || selectedTasks.length === 0}
              >
                {aiLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {selectedTasks.length === 0 ? (
              <p className="empty-state">
                Select a day with tasks to generate AI focus insights.
              </p>
            ) : aiLoading ? (
              <div className="ai-loading">
                <div className="loading-spinner"></div>
                <p>Analyzing your schedule...</p>
              </div>
            ) : aiFocus ? (
              <div className="ai-focus-content">{aiFocus}</div>
            ) : (
              <p className="empty-state">
                Click "Generate" to get AI-powered insights for {selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>

          {/* Day Breakdown */}
          <div className="tasks-card">
            <div className="tasks-card-header">
              <div>
                <h3 className="panel-title">Day Breakdown</h3>
                <p className="panel-subtitle">
                  {selectedDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <span className="status-pill neutral">{selectedTasks.length} scheduled</span>
            </div>

            <div className="tasks-list">
              {selectedTasks.length === 0 && (
                <div className="empty-state-block">
                  <AlertCircle className="empty-icon" />
                  <p>Nothing scheduled for this day</p>
                  <button className="btn-link">
                    <Plus className="btn-link-icon" />
                    Add a task
                  </button>
                </div>
              )}

              {selectedTasks.map((task) => (
                <article key={task.id} className="task-row">
                  <div className="task-row-content">
                    <div className={`task-priority-indicator priority-${task.priority}`}></div>
                    <div className="task-info">
                      <p className="task-title">{task.title}</p>
                      <div className="task-meta">
                        <span className="meta-item">
                          <Clock className="meta-icon" />
                          {task.time}
                        </span>
                        <span className="meta-item">
                          <User className="meta-icon" />
                          {task.owner}
                        </span>
                        <span className="meta-item">
                          <Tag className="meta-icon" />
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`status-pill ${task.status}`}>{statusCopy[task.status]}</span>
                </article>
              ))}
            </div>
          </div>

          {/* Upcoming Focus */}
          <div className="tasks-card compact">
            <h3 className="panel-title">Upcoming Focus</h3>
            <ul className="upcoming-list">
              {upcomingTasks.map((task) => (
                <li key={`upcoming-${task.id}`}>
                  <div className="upcoming-task-info">
                    <div className={`status-dot ${task.status}`} />
                    <div>
                      <p className="task-title">{task.title}</p>
                      <p className="task-meta">
                        {new Date(task.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })} • {task.time}
                      </p>
                    </div>
                  </div>
                  <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
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

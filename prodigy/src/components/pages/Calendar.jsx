import { useMemo, useState } from "react";
import "./Calendar.css";
import { ChevronLeft, ChevronRight, Plus, Sparkles, Clock, User, Tag, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import TaskModal from './TaskModal';

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
  "backlog": "Backlog",
  "in-progress": "In Progress",
  "done": "Done",
};

// Pre-generated AI focus content for the next 5 days
const aiFocusContent = {
  "2025-11-07": `Daily Focus: Kick off the sprint with clear planning and align the team on priorities.

Prioritization:
- Top: Sprint planning sync (critical for setting week's direction)
- Second: Review any carry-over tasks from previous sprint
- Time-sensitive: Morning sync at 9:00 AM sets the day's rhythm

Insights:
- Use the planning session to identify potential blockers early
- Allocate buffer time for unexpected discussions
- Schedule follow-up actions immediately after the meeting`,

  "2025-11-08": `Daily Focus: Refine the user onboarding experience through collaborative design review.

Prioritization:
- Top: Design review at 1:30 PM (key user-facing feature)
- Second: Prepare feedback documentation for design team
- Time-sensitive: Afternoon review session requires prep work

Insights:
- Gather user feedback data before the meeting
- Coordinate with engineering on feasibility constraints
- Document decisions clearly for future reference`,

  "2025-11-09": `Daily Focus: Drive progress on AI Integration while managing the at-risk status.

Prioritization:
- Top: AI Integration work (high priority, at-risk status)
- Second: Monitor integration progress and identify blockers
- Time-sensitive: Late afternoon focus session at 4:00 PM

Insights:
- Break down the integration into smaller, testable components
- Schedule checkpoints to track progress throughout the day
- Prepare contingency plans for potential technical hurdles`,

  "2025-11-10": `Daily Focus: Execute dashboard release while maintaining quality standards.

Prioritization:
- Top: Dashboard release at 11:00 AM (team deliverable)
- Second: Front-end updates in the afternoon
- Time-sensitive: Morning release requires full team attention

Insights:
- Coordinate closely with QA team during release process
- Schedule the customer research task when creative energy is high
- Prepare rollback plan in case of release issues`,

  "2025-11-11": `Daily Focus: Strategic planning and team alignment day.

Prioritization:
- Top: Review week's progress and adjust priorities
- Second: Plan for upcoming content review and team retrospective
- Time-sensitive: Use this lighter day for strategic thinking

Insights:
- Good day for catching up on documentation and process improvements
- Schedule 1:1 meetings with team members if needed
- Prepare materials for tomorrow's progress update`,

  "2025-11-12": `Daily Focus: Communication and progress tracking with stakeholders.

Prioritization:
- Top: Progress Update at 5:30 PM (stakeholder communication)
- Second: Prepare comprehensive update materials
- Time-sensitive: End-of-day presentation requires thorough prep

Insights:
- Gather metrics and success stories throughout the day
- Practice key talking points for the update
- Schedule buffer time before the meeting for final preparations`,

  "2025-11-13": `Daily Focus: Quality assurance and content validation.

Prioritization:
- Top: Content Review at 10:30 AM (compliance critical)
- Second: Security audit preparations
- Time-sensitive: Morning review requires fresh attention

Insights:
- Review materials with security checklist in mind
- Coordinate with legal/compliance team if needed
- Document review outcomes for audit trail`,

  "2025-11-14": `Daily Focus: Preparation and refinement for team retrospective.

Prioritization:
- Top: Gather feedback and insights for retrospective
- Second: Analyze team velocity and process effectiveness
- Time-sensitive: Use today to gather comprehensive feedback

Insights:
- Create safe space for honest team feedback
- Focus on process improvements rather than individual performance
- Prepare action items for implementation next week`,

  "2025-11-15": `Daily Focus: Team reflection and continuous improvement.

Prioritization:
- Top: Team retrospective at 3:00 PM (team health)
- Second: Implement quick wins from retrospective insights
- Time-sensitive: Afternoon session sets tone for next sprint

Insights:
- Facilitate open discussion about what worked and what didn't
- Focus on actionable improvements rather than complaints
- End with clear ownership of action items`
};

const formatDateKey = (date) => {
  if (typeof date === 'string') {
    return date; // Already formatted
  }
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
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(today);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFocus, setAiFocus] = useState("");
  const [tasks, setTasks] = useState(taskSeed);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const tasksByDate = useMemo(() => {
    return tasks.reduce((result, task) => {
      if (!result[task.date]) {
        result[task.date] = [];
      }
      result[task.date].push(task);
      return result;
    }, {});
  }, [tasks]);

  const daysInView = useMemo(
    () => buildCalendarGrid(currentMonth),
    [currentMonth]
  );

  const selectedKey = formatDateKey(selectedDate);
  const selectedTasks = tasksByDate[selectedKey] || [];

  const upcomingTasks = useMemo(() => {
    const todayKey = formatDateKey(today);
    return tasks
      .filter((task) => {
        const taskDate = new Date(task.date);
        const localTaskDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
        const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return localTaskDate >= localToday; // Include today and future dates
      })
      .sort((a, b) => {
        // Sort by date, then by time
        if (a.date !== b.date) {
          return a.date > b.date ? 1 : -1;
        }
        // If same date, sort by time
        return a.time > b.time ? 1 : -1;
      })
      .slice(0, 5);
  }, [today, tasks]);

  // Calculate overview statistics
  const { tasksCompletedThisWeek, highPriorityTasks, upcomingDeadlines } = useMemo(() => {
    const todayKey = formatDateKey(today);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const tasksCompletedThisWeek = tasks.filter(t => {
      const taskDate = new Date(t.date);
      const localTaskDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
      return t.status === 'completed' && localTaskDate >= startOfWeek && localTaskDate <= endOfWeek;
    }).length;

    const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
    
    const upcomingDeadlines = tasks.filter(t => {
      const taskDate = new Date(t.date);
      const localTaskDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
      const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      return localTaskDate >= localToday; // Include today
    }).length;

    return { tasksCompletedThisWeek, highPriorityTasks, upcomingDeadlines };
  }, [tasks, today]);

  const handleGenerateAIFocus = () => {
    setAiLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      if (aiFocusContent[selectedKey]) {
        setAiFocus(aiFocusContent[selectedKey]);
      } else {
        // Generate generic focus for days without pre-defined content
        const taskTitles = selectedTasks.map(task => task.title).join(', ');
        const focus = `Daily Focus: Maximize productivity by focusing on your scheduled tasks: ${taskTitles}

                      Prioritization:
                      - Top priority: ${selectedTasks.find(t => t.priority === 'high')?.title || selectedTasks[0]?.title || 'Review scheduled tasks'}
                      - Secondary: ${selectedTasks.find(t => t.priority === 'medium')?.title || selectedTasks[1]?.title || 'Team coordination'}
                      - Time-sensitive: Complete high-priority items first

                      Insights:
                      - Balance focused work sessions with necessary collaboration
                      - Schedule breaks to maintain energy throughout the day
                      - Document progress and any blockers for future reference
                      - Coordinate with team members on dependent tasks`;
        
        setAiFocus(focus);
      }
      setAiLoading(false);
    }, 800);
  };

  const handleMonthChange = (offset) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + offset);
      return next;
    });
  };

  const handleDaySelect = (day) => {
    // Use the exact date from the calendar grid without timezone conversion
    const selected = new Date(day);
    // Reset time to avoid timezone issues
    const localDate = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    setSelectedDate(localDate);
    setAiFocus(""); // Clear previous AI focus when selecting new day
  };

  const handleCreateTask = () => {
    // Set default date to selected date (fixed for timezone)
    const defaultDate = formatDateKey(selectedDate);
    setEditingTask({
      title: '',
      description: '',
      date: defaultDate,
      time: '09:00',
      owner: 'Product',
      category: 'Meeting',
      priority: 'medium',
      status: 'backlog'
    });
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleSaveTask = (taskData) => {
    if (editingTask && editingTask.id) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? { ...taskData, id: editingTask.id } : task
      ));
    } else {
      // Create new task
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
      };
      setTasks(prev => [...prev, newTask]);
      
      // If the task date is different from selected date, select that date
      if (taskData.date !== selectedKey) {
        const taskDate = new Date(taskData.date);
        const localTaskDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
        setSelectedDate(localTaskDate);
        setCurrentMonth(new Date(localTaskDate.getFullYear(), localTaskDate.getMonth(), 1));
      }
    }
  };

  const monthLabel = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendar-page">
      <header className="calendar-header">
        <div>
          <p className="eyebrow">Planning</p>
          <h1>Schedule & Calendar</h1>
          <p className="subtitle">Manage your team's timeline and deliverables</p>
        </div>
        <div className="header-actions">
          <button type="button" className="btn-secondary" onClick={handleCreateTask}>
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
              // Create a local date without timezone issues
              const localDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
              const key = formatDateKey(localDay);
              const tasksForDay = tasksByDate[key] || [];
              const isOutside = day.getMonth() !== currentMonth.getMonth();
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
                  onClick={() => handleDaySelect(localDay)}
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

          <div className="tasks-card highlights-card">
            <h3 className="panel-title">Overview</h3>
            <ul className="highlights-list">
              <li>Tasks Completed This Week: {tasksCompletedThisWeek}</li>
              <li>High-Priority Tasks: {highPriorityTasks}</li>
              <li>Upcoming Deadlines: {upcomingDeadlines}</li>
              <li>Total Tasks: {tasks.length}</li>
            </ul>
          </div>
        </div>

        <aside className="calendar-sidebar">
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
                  <button className="btn-link" onClick={handleCreateTask}>
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
                  <div className="task-actions">
                    <span className={`status-pill ${task.status}`}>{statusCopy[task.status]}</span>
                    <div className="action-buttons">
                      <button 
                        type="button" 
                        className="action-btn edit-btn"
                        onClick={() => handleEditTask(task)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        type="button" 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Upcoming Focus */}
          <div className="tasks-card compact">
            <h3 className="panel-title">Upcoming Focus</h3>
            <ul className="upcoming-list">
              {upcomingTasks.length === 0 ? (
                <div className="empty-state-block">
                  <AlertCircle className="empty-icon" />
                  <p>No upcoming tasks</p>
                </div>
              ) : (
                upcomingTasks.map((task) => (
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
                ))
              )}
            </ul>
          </div>
        </aside>
      </section>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
};

export default Calendar;
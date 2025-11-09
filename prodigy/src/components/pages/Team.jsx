import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, Users, User, Circle, Sparkles, X, MessageCircle, Plus, Trash2 } from 'lucide-react';

const TeamDashboard = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 9));
  const [selectedChat, setSelectedChat] = useState('team');
  const [message, setMessage] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [showSprintModal, setShowSprintModal] = useState(false);
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  const [messages, setMessages] = useState({
    team: [
      { sender: 'Sarah', text: 'Sprint planning meeting at 2pm', time: '10:30 AM' },
      { sender: 'Mike', text: 'Updated the design mockups', time: '11:15 AM' }
    ],
    sarah: [{ sender: 'Sarah', text: 'Can you review my PR?', time: '9:00 AM' }],
    mike: [{ sender: 'Mike', text: 'Working on the API integration', time: '8:30 AM' }],
    jen: []
  });

  const [sprints, setSprints] = useState([
    { id: 1, start: new Date(2025, 10, 3), end: new Date(2025, 10, 23), name: 'Sprint 1' },
    { id: 2, start: new Date(2025, 11, 1), end: new Date(2025, 11, 21), name: 'Sprint 2' },
  ]);

  const [deadlines, setDeadlines] = useState([
    { id: 1, date: new Date(2025, 10, 15), title: 'Feature Freeze', priority: 'high' },
    { id: 2, date: new Date(2025, 10, 23), title: 'Sprint 1 Demo', priority: 'medium' },
    { id: 3, date: new Date(2025, 11, 10), title: 'Beta Release', priority: 'high' },
    { id: 4, date: new Date(2025, 11, 21), title: 'Sprint 2 Complete', priority: 'medium' }
  ]);

  const [events, setEvents] = useState([
    { id: 1, date: new Date(2025, 10, 12), title: 'Team Standup', color: 'event-green' },
    { id: 2, date: new Date(2025, 10, 20), title: 'Client Review', color: 'event-purple' }
  ]);

  const [progressData] = useState([
    { label: 'Design', value: 85, color: 'progress-blue' },
    { label: 'Frontend', value: 65, color: 'progress-green' },
    { label: 'Backend', value: 72, color: 'progress-purple' },
    { label: 'Testing', value: 45, color: 'progress-orange' }
  ]);

  const teamMembers = [
    { id: 'sarah', name: 'Sarah', role: 'Designer', unread: 1 },
    { id: 'mike', name: 'Mike', role: 'Developer', unread: 0 },
    { id: 'jen', name: 'Jen', role: 'QA', unread: 0 }
  ];

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setAiLoading(true);
    setAiResponse('');
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a project management AI assistant. The user is managing a team with the following context:
            
Current Sprints: ${JSON.stringify(sprints.map(s => ({ name: s.name, start: s.start.toDateString(), end: s.end.toDateString() })))}
Current Deadlines: ${JSON.stringify(deadlines.map(d => ({ title: d.title, date: d.date.toDateString(), priority: d.priority })))}
Current Events: ${JSON.stringify(events.map(e => ({ title: e.title, date: e.date.toDateString() })))}
Team Progress: Design 85%, Frontend 65%, Backend 72%, Testing 45%

User Request: ${aiPrompt}

Please provide helpful project management insights, suggestions, or generate requested content. If they ask you to create sprints, deadlines, or events, provide the details in a clear format they can use.`
          }]
        })
      });

      const data = await response.json();
      const text = data.content.map(item => item.type === 'text' ? item.text : '').join('\n');
      setAiResponse(text);
    } catch (error) {
      setAiResponse('Error generating response. Please try again.');
      console.error('AI Error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const isInSprint = (date) => {
    return sprints.find(sprint => date >= sprint.start && date <= sprint.end);
  };

  const isSprintBoundary = (date) => {
    return sprints.find(sprint => 
      date.toDateString() === sprint.start.toDateString() || 
      date.toDateString() === sprint.end.toDateString()
    );
  };

  const hasDeadline = (date) => {
    return deadlines.find(d => d.date.toDateString() === date.toDateString());
  };

  const hasEvent = (date) => {
    return events.find(e => e.date.toDateString() === date.toDateString());
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleCreateSprint = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSprint = {
      id: Date.now(),
      start: new Date(formData.get('startDate')),
      end: new Date(formData.get('endDate')),
      name: formData.get('name')
    };
    setSprints([...sprints, newSprint]);
    setShowSprintModal(false);
    e.target.reset();
  };

  const handleCreateDeadline = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDeadline = {
      id: Date.now(),
      date: new Date(formData.get('date')),
      title: formData.get('title'),
      priority: formData.get('priority')
    };
    setDeadlines([...deadlines, newDeadline]);
    setShowDeadlineModal(false);
    e.target.reset();
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      id: Date.now(),
      date: new Date(formData.get('date')),
      title: formData.get('title'),
      color: formData.get('color')
    };
    setEvents([...events, newEvent]);
    setShowEventModal(false);
    e.target.reset();
  };

  const deleteDeadline = (id) => {
    setDeadlines(deadlines.filter(d => d.id !== id));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const deleteSprint = (id) => {
    setSprints(sprints.filter(s => s.id !== id));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const days = [];
    const today = new Date();

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day-empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const inSprint = isInSprint(date);
      const isBoundary = isSprintBoundary(date);
      const deadline = hasDeadline(date);
      const event = hasEvent(date);
      const isToday = date.toDateString() === today.toDateString();

      const classes = ['calendar-day'];
      if (inSprint) {
        if (isBoundary) {
          classes.push('sprint-boundary');
        } else {
          classes.push('sprint-week');
        }
      }
      if (isToday) classes.push('today');

      days.push(
        <div key={day} className={classes.join(' ')}>
          <div className="day-number">{day}</div>
          {deadline && (
            <div className={`calendar-badge ${deadline.priority === 'high' ? 'deadline-high' : 'deadline-medium'}`}>
              {deadline.title}
            </div>
          )}
          {event && (
            <div className={`calendar-badge ${event.color}`}>
              {event.title}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const sendMessage = () => {
    if (message.trim()) {
      setMessages({
        ...messages,
        [selectedChat]: [
          ...messages[selectedChat],
          { sender: 'You', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]
      });
      setMessage('');
    }
  };

  const ProgressCircle = ({ value, label, color }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="progress-circle-container">
        <div className="progress-circle">
          <svg className="progress-svg">
            <circle cx="48" cy="48" r={radius} className="progress-bg" />
            <circle cx="48" cy="48" r={radius} className={`progress-fg ${color}`} strokeDasharray={circumference} strokeDashoffset={offset} />
          </svg>
          <div className="progress-value">
            <span>{value}%</span>
          </div>
        </div>
        <span className="progress-label">{label}</span>
      </div>
    );
  };

  const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{title}</h3>
            <button onClick={onClose} className="modal-close">
              <X />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
          background-color: #111827;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .main-content {
          flex: 1;
          padding: 24px;
          overflow: auto;
        }

        .card {
          background-color: #1f2937;
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid #374151;
        }

        .section-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 24px;
          color: #f3f4f6;
        }

        .section-title-white {
          font-size: 24px;
          font-weight: bold;
          color: white;
        }

        .progress-grid {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
        }

        .progress-circle-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .progress-circle {
          position: relative;
          width: 96px;
          height: 96px;
        }

        .progress-svg {
          transform: rotate(-90deg);
          width: 96px;
          height: 96px;
        }

        .progress-bg {
          stroke: #374151;
          stroke-width: 8;
          fill: none;
        }

        .progress-fg {
          stroke-width: 8;
          fill: none;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease;
        }

        .progress-blue {
          stroke: #60a5fa;
        }

        .progress-green {
          stroke: #4ade80;
        }

        .progress-purple {
          stroke: #c084fc;
        }

        .progress-orange {
          stroke: #fb923c;
        }

        .progress-value {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-value span {
          font-size: 18px;
          font-weight: bold;
          color: #f3f4f6;
        }

        .progress-label {
          font-size: 14px;
          margin-top: 8px;
          font-weight: 500;
          color: #d1d5db;
        }

        .ai-card {
          background: linear-gradient(to right, #9333ea, #3b82f6);
          border: none;
        }

        .ai-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .ai-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        .ai-content {
          background-color: #1f2937;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #374151;
        }

        .ai-textarea {
          width: 100%;
          padding: 12px;
          background-color: #111827;
          border: 1px solid #4b5563;
          color: #f3f4f6;
          border-radius: 8px;
          outline: none;
          resize: none;
          font-family: inherit;
          font-size: 14px;
        }

        .ai-textarea::placeholder {
          color: #6b7280;
        }

        .ai-textarea:focus {
          box-shadow: 0 0 0 2px #a855f7;
          border-color: #a855f7;
        }

        .ai-button {
          margin-top: 12px;
          padding: 8px 24px;
          background: linear-gradient(to right, #a855f7, #3b82f6);
          color: white;
          border-radius: 8px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .ai-button:hover:not(:disabled) {
          opacity: 0.9;
        }

        .ai-button:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .ai-response {
          margin-top: 16px;
          padding: 16px;
          background-color: #111827;
          border-radius: 8px;
          border: 1px solid #4b5563;
          color: #e5e7eb;
          font-size: 14px;
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .calendar-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-button {
          padding: 8px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          border-radius: 8px;
          color: #d1d5db;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-button:hover {
          background-color: #374151;
        }

        .calendar-month {
          font-size: 18px;
          font-weight: 600;
          color: #f3f4f6;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 8px 16px;
          color: white;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn-blue {
          background-color: #2563eb;
        }

        .btn-red {
          background-color: #dc2626;
        }

        .btn-green {
          background-color: #16a34a;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .calendar-weekday {
          text-align: center;
          font-weight: 600;
          color: #9ca3af;
          padding: 8px;
          font-size: 14px;
        }

        .calendar-day-empty {
          height: 80px;
        }

        .calendar-day {
          height: 80px;
          border: 1px solid #4b5563;
          padding: 4px;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
          background-color: #1f2937;
          cursor: pointer;
          border-radius: 4px;
        }

        .calendar-day:hover {
          background-color: #374151;
        }

        .calendar-day.sprint-week {
          background-color: #172554;
        }

        .calendar-day.sprint-boundary {
          background-color: #1e3a8a;
          border: 2px solid #60a5fa;
        }

        .calendar-day.today {
          box-shadow: 0 0 0 2px #60a5fa;
        }

        .day-number {
          font-size: 14px;
          font-weight: 600;
          color: #f3f4f6;
        }

        .calendar-badge {
          font-size: 12px;
          margin-top: 4px;
          padding: 2px 4px;
          border-radius: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .deadline-high {
          background-color: #ef4444;
          color: white;
        }

        .deadline-medium {
          background-color: #eab308;
          color: #1f2937;
        }

        .event-green {
          background-color: #22c55e;
          color: white;
        }

        .event-purple {
          background-color: #a855f7;
          color: white;
        }

        .event-pink {
          background-color: #ec4899;
          color: white;
        }

        .event-orange {
          background-color: #f97316;
          color: white;
        }

        .calendar-legend {
          margin-top: 16px;
          display: flex;
          gap: 16px;
          font-size: 14px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-item span {
          color: #d1d5db;
        }

        .legend-box {
          width: 16px;
          height: 16px;
          border-radius: 2px;
        }

        .legend-box.sprint-week {
          background-color: #172554;
          border: 1px solid #4b5563;
        }

        .legend-box.sprint-boundary {
          background-color: #1e3a8a;
          border: 2px solid #60a5fa;
        }

        .list-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background-color: #111827;
          border-radius: 8px;
          border: 1px solid #374151;
          transition: background-color 0.2s;
        }

        .list-item:hover {
          background-color: #1f2937;
        }

        .list-item-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .list-item-end {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .item-title {
          font-weight: 500;
          color: #f3f4f6;
        }

        .item-subtitle {
          color: #9ca3af;
          font-size: 14px;
          margin-left: 8px;
        }

        .item-date {
          color: #9ca3af;
          font-size: 14px;
        }

        .icon-blue {
          width: 12px;
          height: 12px;
          fill: #60a5fa;
          color: #60a5fa;
          flex-shrink: 0;
        }

        .icon-red {
          width: 12px;
          height: 12px;
          fill: #ef4444;
          color: #ef4444;
          flex-shrink: 0;
        }

        .icon-yellow {
          width: 12px;
          height: 12px;
          fill: #eab308;
          color: #eab308;
          flex-shrink: 0;
        }

        .delete-button {
          color: #f87171;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .delete-button:hover {
          color: #ef4444;
        }

        .chat-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          background-color: #2563eb;
          color: white;
          border-radius: 50%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 40;
          transition: background-color 0.2s;
        }

        .chat-fab:hover {
          background-color: #1d4ed8;
        }

        .chat-panel {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 320px;
          height: 500px;
          background-color: #1f2937;
          border-radius: 8px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          z-index: 40;
          border: 1px solid #374151;
        }

        .chat-header {
          padding: 16px;
          border-bottom: 1px solid #374151;
          background-color: #2563eb;
          color: white;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header h3 {
          font-weight: bold;
          margin: 0;
          font-size: 16px;
        }

        .chat-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-close:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .chat-list {
          border-bottom: 1px solid #374151;
          overflow-y: auto;
          max-height: 160px;
          background-color: #111827;
        }

        .chat-list-item {
          width: 100%;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.2s;
          color: #e5e7eb;
        }

        .chat-list-item:hover {
          background-color: #374151;
        }

        .chat-list-item.active {
          background-color: #374151;
        }

        .chat-icon {
          width: 16px;
          height: 16px;
          color: #d1d5db;
          flex-shrink: 0;
        }

        .chat-name {
          font-size: 14px;
          font-weight: 500;
        }

        .chat-member-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .chat-member-text {
          display: flex;
          flex-direction: column;
        }

        .chat-member-name {
          font-size: 14px;
          font-weight: 500;
          color: #e5e7eb;
        }

        .chat-member-role {
          font-size: 12px;
          color: #6b7280;
        }

        .chat-unread-badge {
          background-color: #2563eb;
          color: white;
          font-size: 12px;
          border-radius: 50%;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background-color: #111827;
        }

        .chat-message {
          display: flex;
        }

        .chat-message.own-message {
          justify-content: flex-end;
        }

        .message-bubble {
          display: inline-block;
          max-width: 75%;
          border-radius: 8px;
          padding: 8px 12px;
        }

        .own-bubble {
          background-color: #2563eb;
          color: white;
        }

        .other-bubble {
          background-color: #374151;
          color: #f3f4f6;
        }

        .message-sender {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 4px;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message-time {
          font-size: 11px;
          margin-top: 4px;
          opacity: 0.7;
        }

        .chat-input-container {
          padding: 12px;
          border-top: 1px solid #374151;
          background-color: #1f2937;
          display: flex;
          gap: 8px;
        }

        .chat-input {
          flex: 1;
          padding: 8px 12px;
          font-size: 14px;
          background-color: #111827;
          border: 1px solid #4b5563;
          color: #f3f4f6;
          border-radius: 8px;
          outline: none;
          font-family: inherit;
        }

        .chat-input::placeholder {
          color: #6b7280;
        }

        .chat-input:focus {
          box-shadow: 0 0 0 2px #2563eb;
          border-color: #2563eb;
        }

        .chat-send-button {
          padding: 8px 12px;
          background-color: #2563eb;
          color: white;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-send-button:hover {
          background-color: #1d4ed8;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }

        .modal-content {
          background-color: #1f2937;
          border-radius: 8px;
          padding: 24px;
          width: 384px;
          max-width: calc(100% - 32px);
          margin: 0 16px;
          border: 1px solid #374151;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: bold;
          color: #f3f4f6;
          margin: 0;
        }

        .modal-close {
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .modal-close:hover {
          color: #f3f4f6;
          background-color: #374151;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #d1d5db;
        }

        .form-input {
          width: 100%;
          padding: 8px 12px;
          background-color: #111827;
          border: 1px solid #4b5563;
          color: #f3f4f6;
          border-radius: 8px;
          font-family: inherit;
          font-size: 14px;
          outline: none;
        }

        .form-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>

      <div className="main-content">
        {/* Progress Section */}
        <div className="card">
          <h2 className="section-title">Team Progress</h2>
          <div className="progress-grid">
            {progressData.map((item, index) => (
              <ProgressCircle key={index} {...item} />
            ))}
          </div>
        </div>

        {/* AI Generation Section */}
        <div className="card ai-card">
          <div className="ai-header">
            <Sparkles className="ai-icon" />
            <h2 className="section-title-white">AI Assistant</h2>
          </div>
          <div className="ai-content">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask me to analyze team velocity, suggest sprint schedules, create reports, or optimize your project timeline..."
              className="ai-textarea"
              rows="3"
            />
            <button 
              onClick={handleAIGenerate}
              disabled={aiLoading}
              className="ai-button"
            >
              {aiLoading ? 'Generating...' : 'Generate'}
            </button>
            {aiResponse && (
              <div className="ai-response">
                {aiResponse}
              </div>
            )}
          </div>
        </div>

        {/* Calendar Section */}
        <div className="card">
          <div className="calendar-header">
            <h2 className="section-title">Sprint Calendar</h2>
            <div className="calendar-nav">
              <button onClick={() => navigateMonth(-1)} className="nav-button">
                <ChevronLeft />
              </button>
              <span className="calendar-month">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </span>
              <button onClick={() => navigateMonth(1)} className="nav-button">
                <ChevronRight />
              </button>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              onClick={() => setShowSprintModal(true)}
              className="btn btn-blue"
            >
              <Plus size={16} />
              Create Sprint
            </button>
            <button 
              onClick={() => setShowDeadlineModal(true)}
              className="btn btn-red"
            >
              <Plus size={16} />
              Create Deadline
            </button>
            <button 
              onClick={() => setShowEventModal(true)}
              className="btn btn-green"
            >
              <Plus size={16} />
              Create Event
            </button>
          </div>

          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-box sprint-week"></div>
              <span>Sprint Week</span>
            </div>
            <div className="legend-item">
              <div className="legend-box sprint-boundary"></div>
              <span>Sprint Start/End</span>
            </div>
          </div>
        </div>

        {/* Sprints List */}
        <div className="card">
          <h2 className="section-title">Active Sprints</h2>
          <div className="list-container">
            {sprints.map((sprint) => (
              <div key={sprint.id} className="list-item">
                <div className="list-item-content">
                  <Circle className="icon-blue" />
                  <div>
                    <span className="item-title">{sprint.name}</span>
                    <span className="item-subtitle">
                      {sprint.start.toLocaleDateString()} - {sprint.end.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteSprint(sprint.id)} className="delete-button">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines Section */}
        <div className="card">
          <h2 className="section-title">Upcoming Deadlines</h2>
          <div className="list-container">
            {deadlines.sort((a, b) => a.date - b.date).map((deadline) => (
              <div key={deadline.id} className="list-item">
                <div className="list-item-content">
                  <Circle className={deadline.priority === 'high' ? 'icon-red' : 'icon-yellow'} />
                  <span className="item-title">{deadline.title}</span>
                </div>
                <div className="list-item-end">
                  <span className="item-date">
                    {deadline.date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <button onClick={() => deleteDeadline(deadline.id)} className="delete-button">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="chat-fab"
        >
          <MessageCircle />
        </button>
      )}

      {/* Floating Chat Panel */}
      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <h3>Messages</h3>
            <button onClick={() => setChatOpen(false)} className="chat-close">
              <X />
            </button>
          </div>

          <div className="chat-list">
            <button
              onClick={() => setSelectedChat('team')}
              className={`chat-list-item ${selectedChat === 'team' ? 'active' : ''}`}
            >
              <Users className="chat-icon" />
              <span className="chat-name">Team Chat</span>
            </button>
            {teamMembers.map(member => (
              <button
                key={member.id}
                onClick={() => setSelectedChat(member.id)}
                className={`chat-list-item ${selectedChat === member.id ? 'active' : ''}`}
              >
                <div className="chat-member-info">
                  <User className="chat-icon" />
                  <div className="chat-member-text">
                    <div className="chat-member-name">{member.name}</div>
                    <div className="chat-member-role">{member.role}</div>
                  </div>
                </div>
                {member.unread > 0 && (
                  <span className="chat-unread-badge">
                    {member.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="chat-messages">
            {messages[selectedChat]?.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender === 'You' ? 'own-message' : ''}`}>
                <div className={`message-bubble ${msg.sender === 'You' ? 'own-bubble' : 'other-bubble'}`}>
                  {msg.sender !== 'You' && (
                    <div className="message-sender">{msg.sender}</div>
                  )}
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="chat-input"
            />
            <button
              onClick={sendMessage}
              className="chat-send-button"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal show={showSprintModal} onClose={() => setShowSprintModal(false)} title="Create Sprint">
        <form onSubmit={handleCreateSprint} className="modal-form">
          <div className="form-group">
            <label>Sprint Name</label>
            <input type="text" name="name" required className="form-input" />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" required className="form-input" />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" required className="form-input" />
          </div>
          <button type="submit" className="btn btn-blue" style={{width: '100%', justifyContent: 'center'}}>Create Sprint</button>
        </form>
      </Modal>

      <Modal show={showDeadlineModal} onClose={() => setShowDeadlineModal(false)} title="Create Deadline">
        <form onSubmit={handleCreateDeadline} className="modal-form">
          <div className="form-group">
            <label>Deadline Title</label>
            <input type="text" name="title" required className="form-input" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" required className="form-input" />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" className="form-input">
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>
          <button type="submit" className="btn btn-red" style={{width: '100%', justifyContent: 'center'}}>Create Deadline</button>
        </form>
      </Modal>

      <Modal show={showEventModal} onClose={() => setShowEventModal(false)} title="Create Event">
        <form onSubmit={handleCreateEvent} className="modal-form">
          <div className="form-group">
            <label>Event Title</label>
            <input type="text" name="title" required className="form-input" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" required className="form-input" />
          </div>
          <div className="form-group">
            <label>Color</label>
            <select name="color" className="form-input">
              <option value="event-green">Green</option>
              <option value="event-purple">Purple</option>
              <option value="event-pink">Pink</option>
              <option value="event-orange">Orange</option>
            </select>
          </div>
          <button type="submit" className="btn btn-green" style={{width: '100%', justifyContent: 'center'}}>Create Event</button>
        </form>
      </Modal>
    </div>
  );
};

export default TeamDashboard;
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Send, Users, User, Circle, Sparkles, X, MessageCircle, Plus, Trash2 } from 'lucide-react';
import './Team.css';

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
    { id: 1, date: new Date(2025, 10, 12), title: 'Team Standup', color: 'green' },
    { id: 2, date: new Date(2025, 10, 20), title: 'Client Review', color: 'purple' }
  ]);

  const [progressData] = useState([
    { label: 'Design', value: 85, color: 'blue' },
    { label: 'Frontend', value: 65, color: 'green' },
    { label: 'Backend', value: 72, color: 'purple' },
    { label: 'Testing', value: 45, color: 'orange' }
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

      let dayClasses = 'calendar-day';
      if (inSprint) {
        if (isBoundary) {
          dayClasses += ' sprint-boundary';
        } else {
          dayClasses += ' sprint-week';
        }
      }
      if (isToday) {
        dayClasses += ' today';
      }

      days.push(
        <div key={day} className={dayClasses}>
          <div className="day-number">{day}</div>
          {deadline && (
            <div className={`calendar-badge deadline-${deadline.priority}`}>
              {deadline.title}
            </div>
          )}
          {event && (
            <div className={`calendar-badge event-${event.color}`}>
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
            <circle 
              cx="48" 
              cy="48" 
              r={radius} 
              className={`progress-fg progress-${color}`}
              strokeDasharray={circumference} 
              strokeDashoffset={offset}
            />
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
      {/* Main Content */}
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
            <button onClick={() => setShowSprintModal(true)} className="btn btn-blue">
              <Plus className="btn-icon" />
              Create Sprint
            </button>
            <button onClick={() => setShowDeadlineModal(true)} className="btn btn-red">
              <Plus className="btn-icon" />
              Create Deadline
            </button>
            <button onClick={() => setShowEventModal(true)} className="btn btn-green">
              <Plus className="btn-icon" />
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
                  <Trash2 />
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
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} className="chat-fab">
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
                  <span className="chat-unread-badge">{member.unread}</span>
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
            <button onClick={sendMessage} className="chat-send-button">
              <Send />
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
          <button type="submit" className="btn btn-blue btn-full">Create Sprint</button>
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
          <button type="submit" className="btn btn-red btn-full">Create Deadline</button>
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
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="pink">Pink</option>
              <option value="orange">Orange</option>
            </select>
          </div>
          <button type="submit" className="btn btn-green btn-full">Create Event</button>
        </form>
      </Modal>
    </div>
  );
};

export default TeamDashboard;
import { useState } from 'react';
import { X, Calendar, User, Tag, AlertCircle } from 'lucide-react';
import './TaskModal.css';

const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    date: task?.date || '',
    time: task?.time || '09:00',
    owner: task?.owner || 'Product',
    category: task?.category || 'Meeting',
    priority: task?.priority || 'medium',
    status: task?.status || 'backlog'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      id: task?.id || `task-${Date.now()}`,
    };
    onSave(taskData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
          <button type="button" className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Calendar size={16} />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <User size={16} />
                Owner
              </label>
              <select
                name="owner"
                value={formData.owner}
                onChange={handleChange}
              >
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Engineering">Engineering</option>
                <option value="QA">QA</option>
                <option value="Marketing">Marketing</option>
                <option value="Research">Research</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <Tag size={16} />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Meeting">Meeting</option>
                <option value="Review">Review</option>
                <option value="Deliverable">Deliverable</option>
                <option value="QA">QA</option>
                <option value="Customer">Customer</option>
                <option value="Content">Content</option>
                <option value="Audit">Audit</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <AlertCircle size={16} />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
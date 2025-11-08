import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password reset logic here
    console.log('Password reset requested for:', email);
    setSubmitted(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="sidebar-content">
          <h1 className="sidebar-title">Password Reset</h1>
          <p className="sidebar-text">
            No worries! We'll help you get back into your account.
            Follow the simple steps to reset your password securely.
          </p>
        </div>
      </div>
      <div className="auth-box">
        <h2 className="auth-title">Reset your password</h2>
        <p className="auth-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {submitted ? (
          <div className="success-message">
            <span className="success-icon">✓</span>
            <p>
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <button type="submit" className="auth-button">
                Reset Password
              </button>
            </div>
          </form>
        )}

        <div className="auth-links">
          <Link to="/login" className="auth-link">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="sidebar-content">
          <h1 className="sidebar-title">Welcome to Prodigy</h1>
          <p className="sidebar-text">
            Access your personalized dashboard and manage your work efficiently.
            Sign in to get started with your productivity journey.
          </p>
        </div>
      </div>
      <div className="auth-box">
        <h2 className="auth-title">Sign in to your account</h2>
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
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-links" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
            <Link to="/signup" className="auth-link">
              Create account
            </Link>
          </div>

          <div className="form-group">
            <button type="submit" className="auth-button">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">
          Enter your email and we’ll send you a reset link.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="auth-button">
            Send Reset Link
          </button>

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              Back to login
            </Link>
            <Link to="/signup" className="auth-link">
              Create account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

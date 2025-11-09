import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", formData);

    // ✅ Set authenticated
    setIsAuthenticated(true);

    // Redirect to profile setup
    navigate("/profile-setup");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign in to Prodigy</h2>
        <p className="auth-subtitle">Enter your credentials to continue</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
          />
          <div className="auth-links">
            <Link to="/forgot-password" className="auth-link">Forgot password?</Link>
            <Link to="/signup" className="auth-link">Create account</Link>
          </div>
          <button type="submit" className="auth-button">Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

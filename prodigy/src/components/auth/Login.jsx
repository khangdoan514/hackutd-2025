import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/signin", formData);
      if (response.data.success) {
        console.log("Login successful");
        navigate("/profile-setup"); // Redirect to ProfileSetup
      }
    } catch (error) {
      console.log("Login failed:", error.response?.data?.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome</h2>
        <p className="auth-subtitle">Sign in to your Prodigy workspace</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-button">
            Sign In
          </button>

          <div className="auth-links">
            <a href="/forgot-password" className="auth-link">
              Forgot password?
            </a>
            <a href="/signup" className="auth-link">
              Create account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
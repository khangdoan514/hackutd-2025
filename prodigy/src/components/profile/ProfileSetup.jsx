import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../auth/Auth.css";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    birthday: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile data:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Profile</h2>
        <p className="auth-subtitle">Complete your setup to get started with Prodigy</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input"
            required
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
            required
          />

          {/* Role dropdown */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`form-input ${!formData.role ? "placeholder" : ""}`}
            required
          >
            {/* This is the placeholder, disabled and hidden once selected */}
            <option value="" hidden>
              Select your role
            </option>
            <option value="Project Manager">Project Manager</option>
            <option value="Designer">Designer</option>
            <option value="Developer">Developer</option>
          </select>

          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="form-input"
            required
          />

          <button type="submit" className="auth-button">
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
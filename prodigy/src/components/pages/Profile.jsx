import React, { useState } from "react";
import { User, Mail, Phone, Lock, Edit3, Save } from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "Frabina Edwin",
    email: "frabina@example.com",
    phone: "+1 (555) 123-4567",
    password: "********",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    if (!isEditing) return; // prevent changes unless editing mode is active
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Save changes
      console.log("Profile updated:", formData);
      alert("Profile saved successfully!");
    }
    setIsEditing((prev) => !prev);
  };

  return (
    <div className="dashboard-page">
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Account</p>
            <h1>Profile Settings</h1>
            <p className="subtitle">Update your personal information</p>
          </div>
        </header>

        <section className="profile-card">
          <form className="profile-form">
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              <Phone className="input-icon" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>

            <button onClick={handleEditToggle} className="save-btn">
              {isEditing ? (
                <>
                  <Save size={16} /> Save Changes
                </>
              ) : (
                <>
                  <Edit3 size={16} /> Edit Profile
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

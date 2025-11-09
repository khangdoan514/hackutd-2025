import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand with heart */}
        <div className="brand">
          <span className="heart">♡</span> Prodigy
        </div>

        <div className="nav-links">
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link" to="/calendar">Calendar</Link>
          <Link className="nav-link" to="/team">Team</Link>
          <Link className="nav-link" to="/profile">Profile</Link>
        </div>
      </div>
    </nav>
  );
}

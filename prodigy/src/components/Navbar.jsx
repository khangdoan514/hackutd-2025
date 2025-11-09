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

        {/* Right-aligned nav links */}
        <div className="nav-links">
          <Link className="nav-link" to="/">Dashboard</Link>
          <Link className="nav-link" to="/projects">Calendar</Link>
          <Link className="nav-link" to="/designs">Team</Link>
        </div>
      </div>
    </nav>
  );
}

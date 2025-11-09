import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import axios from "axios";

// Pages
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ProfileSetup from "./components/profile/ProfileSetup";

// Navs
import Navbar from "./components/Navbar";
import Dashboard from "./components/pages/Dashboard";
import Calendar from "./components/pages/Calendar";
import Team from "./components/pages/Team"
import Profile from "./components/pages/Profile"

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const Layout = () => (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-20">
        <Navbar 
          currentPage={currentPage} 
          onPageChange={handlePageChange}
          onGetStarted=""
        />
      </div>
      <div className="flex-1 pt-16">
        <Outlet />
      </div>
    </div>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/team" element={<Team />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;

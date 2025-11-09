import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from "axios"

// Pages
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import ForgotPassword from './components/auth/ForgotPassword'
import ProfileSetup from './components/profile/ProfileSetup'
import Dashboard from './components/pages/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Example HomePage / Dashboard
  const HomePage = () => {
    const [array, setArray] = useState([])

    useEffect(() => {
      const fetchAPI = async () => {
        try {
          const response = await axios.get("http://localhost:3000/api/message");
          setArray(response.data.message);
        } catch (error) {
          console.error("API fetch failed:", error);
        }
      }
      fetchAPI();
    }, []);

    return (
      <div className="p-8">
        <h1>Welcome to the Dashboard</h1>
        <div className="mt-4">
          {array.map((message, index) => (
            <div key={index} className="mb-2">
              <span>{message}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* Signup */}
        <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />

        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Profile Setup */}
        <Route path="/profile-setup" element={<ProfileSetup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App

import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import ForgotPassword from './components/auth/ForgotPassword'
import './App.css'
import axios from "axios"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const HomePage = () => {
    const [array, setArray] = useState([])

    useEffect(() => {
      const fetchAPI = async () => {
        const response = await axios.get("http://localhost:3000/api/message");
        setArray(response.data.message);
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App

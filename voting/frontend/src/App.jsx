import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CloudBackground from './components/CloudBackground';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Results from './pages/Results';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sky-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <CloudBackground>
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          {/* Public Login Route */}
          <Route 
            path="/login" 
            element={!user ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />} 
          />

          {/* Student Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              user && user.role === 'student' 
                ? <StudentDashboard user={user} onUserUpdate={handleUserUpdate} /> 
                : <Navigate to="/login" replace />
            } 
          />

          {/* Admin Dashboard Route */}
          <Route 
            path="/admin" 
            element={
              user && user.role === 'admin' 
                ? <AdminDashboard /> 
                : <Navigate to="/login" replace />
            } 
          />

          {/* Shared Results Page Route */}
          <Route 
            path="/results" 
            element={
              user 
                ? <Results user={user} /> 
                : <Navigate to="/login" replace />
            } 
          />

          {/* Wildcard Fallback Route */}
          <Route 
            path="*" 
            element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} replace />} 
          />
        </Routes>
      </CloudBackground>
    </Router>
  );
}

export default App;

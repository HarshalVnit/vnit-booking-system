import React, { useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import BookingForm from './pages/BookingForm';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentStatus from './pages/StudentStatus';
import Home from './pages/Home';
import Login from './pages/Login';
import Footer from './components/Footer';
import vnitLogo from './assets/vnit-logo-1.jpg';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // --- NEW: Logout Function ---
  const handleLogout = () => {
    setIsAuthenticated(false); // Locks the dashboard
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* NAVBAR */}
      <nav style={{ padding: '10px 40px', backgroundColor: '#002147', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={vnitLogo} alt="VNIT Logo" style={{ height: '50px', borderRadius: '50%' }} />
            <h2 style={{ margin: 0 }}>VNIT Guest House</h2>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
          <Link to="/book" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Book Room</Link>
          <Link to="/status" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Check Status</Link>
          <Link to="/dashboard" style={{ color: '#f39c12', textDecoration: 'none', fontWeight: 'bold' }}>Faculty Login</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookingForm />} />
          <Route path="/status" element={<StudentStatus />} />
          
          <Route 
            path="/login" 
            element={<Login setIsAuthenticated={setIsAuthenticated} />} 
          />
          
          {/* PROTECTED ROUTE: Passes the logout function to the dashboard */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <FacultyDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
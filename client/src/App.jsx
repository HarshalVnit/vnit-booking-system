import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import FacultyDashboard from './FacultyDashboard'; 
import BookingForm from './BookingForm'; 

// A simple Navigation Bar to switch tabs
const Navbar = () => (
  <nav style={{ background: '#333', padding: '15px', color: 'white', marginBottom: '20px' }}>
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>VNIT Portal</span>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '20px', textDecoration: 'none' }}>Student Booking</Link>
        <Link to="/faculty" style={{ color: '#ffcc00', textDecoration: 'none' }}>Faculty Login</Link>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <div>
      <Navbar />
      
      {/* The "Stage" that changes based on the URL */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <Routes>
          <Route path="/" element={<BookingForm />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
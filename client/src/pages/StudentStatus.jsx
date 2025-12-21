import React, { useState } from 'react';
import axios from 'axios';

const StudentStatus = () => {
    const [email, setEmail] = useState('');
    const [studentId, setStudentId] = useState(''); // <--- Using Student ID now
    const [booking, setBooking] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setBooking(null);

        try {
            // Updated to send 'studentId' matching the backend controller
            const response = await axios.get(`http://localhost:5000/api/bookings/student-lookup`, {
                params: { email, studentId }
            });
            setBooking(response.data[0]); 
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setMessage("❌ No record found. Check your Email & Student ID.");
            } else {
                setMessage("❌ Server Error.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Styles
    const containerStyle = { maxWidth: '500px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: "'Segoe UI', sans-serif" };
    const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' };
    const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' };
    
    // Card Styles
    const cardStyle = {
        marginTop: '20px', padding: '20px', borderRadius: '10px',
        backgroundColor: booking?.status === 'approved' ? '#d4edda' : booking?.status === 'rejected' ? '#f8d7da' : '#fff3cd',
        border: `2px solid ${booking?.status === 'approved' ? '#c3e6cb' : booking?.status === 'rejected' ? '#f5c6cb' : '#ffeeba'}`,
        color: '#333'
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center', color: '#444', marginBottom: '20px' }}>🔎 Track Your Request</h2>
            
            <form onSubmit={handleSearch}>
                <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Registered Email</label>
                <input type="email" placeholder="e.g. rahul@vnit.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                
                {/* --- UPDATED FIELD: Student ID --- */}
                <label style={{fontWeight:'bold', display:'block', marginBottom:'5px'}}>Student ID</label>
                <input 
                    type="text" 
                    placeholder="e.g. 31714" 
                    value={studentId} 
                    onChange={(e) => setStudentId(e.target.value)} 
                    required 
                    style={inputStyle} 
                />
                
                <button type="submit" style={btnStyle}>{loading ? 'Searching...' : 'Check Status'}</button>
            </form>

            {message && <p style={{ textAlign: 'center', marginTop: '20px', color: '#d9534f', fontWeight: 'bold' }}>{message}</p>}

            {booking && (
                <div style={cardStyle}>
                    <h3 style={{ marginTop: 0, textTransform: 'capitalize' }}>
                        Status: {booking.status === 'approved' ? '✅ Allocated' : booking.status === 'rejected' ? '❌ Rejected' : '⏳ Processing'}
                    </h3>
                    <p><strong>Name:</strong> {booking.studentName}</p>
                    <p><strong>Date:</strong> {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                    <p><strong>Type:</strong> {booking.roomType} ({booking.ac ? 'AC' : 'Non-AC'})</p>
                    
                    {booking.status === 'approved' ? (
                        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '5px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>Allocated Room Number</span>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{booking.assignedRoomNumber}</div>
                        </div>
                    ) : (
                        <p style={{ marginTop: '15px', fontStyle: 'italic' }}>
                            {booking.status === 'pending' ? "Please wait, the faculty is reviewing your request." : "Sorry, we could not accommodate your request."}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentStatus;
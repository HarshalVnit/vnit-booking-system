import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Receive the 'onLogout' prop
const FacultyDashboard = ({ onLogout }) => {
    // State
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [availableRooms, setAvailableRooms] = useState([]); 
    const [chosenRoom, setChosenRoom] = useState('');
    
    // Availability Grid State
    const [checkStart, setCheckStart] = useState('');
    const [checkEnd, setCheckEnd] = useState('');
    const [allRoomStatus, setAllRoomStatus] = useState([]);
    const [showStatus, setShowStatus] = useState(false);

    // Occupancy Register State
    const [allocatedBookings, setAllocatedBookings] = useState([]);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => { fetchPendingBookings(); }, []);

    const fetchPendingBookings = async () => {
        try { const res = await axios.get('http://localhost:5000/api/bookings/pending'); setBookings(res.data); } 
        catch (err) { console.error(err); }
    };

    const fetchAllocatedBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bookings/allocated');
            setAllocatedBookings(res.data);
            setShowRegister(!showRegister);
            setShowStatus(false);
        } catch (err) { alert("Error fetching register"); }
    };

    const checkAllRooms = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get('http://localhost:5000/api/bookings/room-status', {
                params: { startDate: checkStart, endDate: checkEnd }
            });
            setAllRoomStatus(res.data);
            setShowStatus(true);
            setShowRegister(false);
        } catch (error) { alert("Error fetching status"); }
    };

    const handleApproveClick = async (booking) => {
        try {
            setSelectedBooking(booking._id);
            setAvailableRooms([]);
            setChosenRoom('');
            const response = await axios.get('http://localhost:5000/api/bookings/available', {
                params: { roomType: booking.roomType, ac: booking.ac, startDate: booking.startDate, endDate: booking.endDate }
            });
            setAvailableRooms(response.data);
        } catch (error) { alert("Error checking room availability"); }
    };

    const confirmAssignment = async () => {
        if (!chosenRoom) return alert("Please select a room first!");
        try {
            await axios.put(`http://localhost:5000/api/bookings/assign/${selectedBooking}`, { roomNumber: chosenRoom });
            setSelectedBooking(null);
            fetchPendingBookings();
            alert(`Room ${chosenRoom} assigned successfully!`);
        } catch (error) { alert("Failed to assign room."); }
    };

    const handleReject = async (id) => {
        if(!window.confirm("Reject request?")) return;
        try { await axios.put(`http://localhost:5000/api/bookings/${id}`, { status: 'rejected' }); fetchPendingBookings(); } 
        catch (e) { alert("Failed"); }
    };

    // Styles
    const btnStyle = { padding:'10px 15px', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontWeight:'bold', marginRight:'10px' };
    const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px', fontSize: '0.9rem', backgroundColor: 'white' };
    const thStyle = { padding: '12px', backgroundColor: '#007bff', color: 'white', textAlign: 'left', border: '1px solid #ddd' };
    const tdStyle = { padding: '10px', border: '1px solid #ddd' };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Segoe UI' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <h1 style={{ color: '#333', margin:0 }}>🛡️ Faculty Dashboard</h1>
                <div>
                    <button onClick={fetchAllocatedBookings} style={{ ...btnStyle, backgroundColor: '#17a2b8' }}>
                        {showRegister ? 'Close Register' : '📋 Occupancy'}
                    </button>
                    
                    {/* --- NEW LOGOUT BUTTON --- */}
                    <button onClick={onLogout} style={{ ...btnStyle, backgroundColor: '#dc3545', marginRight: 0 }}>
                        🚪 Logout
                    </button>
                </div>
            </div>

            {/* OCCUPANCY REGISTER */}
            {showRegister && (
                <div style={{ backgroundColor: '#e9ecef', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #ced4da' }}>
                    <h3 style={{ marginTop: 0, color: '#17a2b8' }}>📋 Current Booked Rooms (Allocation Register)</h3>
                    {allocatedBookings.length === 0 ? <p>No rooms are currently allocated.</p> : (
                        <table style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={{...thStyle, backgroundColor:'#17a2b8'}}>Room No</th>
                                    <th style={{...thStyle, backgroundColor:'#17a2b8'}}>Student Name</th>
                                    <th style={{...thStyle, backgroundColor:'#17a2b8'}}>Student ID</th>
                                    <th style={{...thStyle, backgroundColor:'#17a2b8'}}>Check-in</th>
                                    <th style={{...thStyle, backgroundColor:'#17a2b8'}}>Check-out</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allocatedBookings.map(b => (
                                    <tr key={b._id}>
                                        <td style={{...tdStyle, fontWeight:'bold', fontSize:'1.1rem'}}>{b.assignedRoomNumber}</td>
                                        <td style={tdStyle}>{b.studentName}</td>
                                        <td style={tdStyle}>{b.studentId}</td>
                                        <td style={tdStyle}>{new Date(b.startDate).toLocaleDateString()}</td>
                                        <td style={tdStyle}>{new Date(b.endDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* AVAILABILITY CHECKER */}
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #ddd' }}>
                <h3 style={{ marginTop: 0, color: '#6c757d' }}>📅 Check Availability Grid</h3>
                <form onSubmit={checkAllRooms} style={{ display: 'flex', gap: '15px', alignItems: 'end' }}>
                    <div>
                        <label style={{ display:'block', fontSize:'0.9rem' }}>From:</label>
                        <input type="date" value={checkStart} onChange={e=>setCheckStart(e.target.value)} required style={{padding:'8px', borderRadius:'4px', border:'1px solid #ccc'}} />
                    </div>
                    <div>
                        <label style={{ display:'block', fontSize:'0.9rem' }}>To:</label>
                        <input type="date" value={checkEnd} onChange={e=>setCheckEnd(e.target.value)} required style={{padding:'8px', borderRadius:'4px', border:'1px solid #ccc'}} />
                    </div>
                    <button type="submit" style={{ ...btnStyle, backgroundColor:'#6c757d' }}>Check Grid</button>
                    {showStatus && <button onClick={()=>setShowStatus(false)} style={{marginLeft:'auto', background:'none', border:'none', cursor:'pointer', color:'#dc3545'}}>Close X</button>}
                </form>

                {showStatus && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px', marginTop: '20px' }}>
                        {allRoomStatus.map(room => (
                            <div key={room.roomNumber} style={{
                                padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '0.9rem',
                                backgroundColor: room.status === 'Available' ? '#d4edda' : '#f8d7da',
                                border: `1px solid ${room.status === 'Available' ? '#c3e6cb' : '#f5c6cb'}`
                            }}>
                                <div style={{ fontWeight: 'bold' }}>Room {room.roomNumber}</div>
                                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                                    {room.status === 'Available' ? <span style={{color:'green'}}>Available</span> : <span style={{color:'#721c24'}}>Booked<br/>{room.details.replace('Booked: ', '')}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* PENDING REQUESTS TABLE */}
            <h3 style={{ borderBottom:'2px solid #007bff', paddingBottom:'10px', color: '#007bff' }}>⚡ Action Required (Pending)</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Student</th>
                        <th style={thStyle}>Request Info</th>
                        <th style={thStyle}>Dates</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.length === 0 && <tr><td colSpan="4" style={{padding:'20px', textAlign:'center'}}>No pending requests.</td></tr>}
                    {bookings.map((b) => (
                        <tr key={b._id} style={{ borderBottom: '1px solid #ddd', backgroundColor: selectedBooking === b._id ? '#f1f9ff' : 'white' }}>
                            <td style={tdStyle}><strong>{b.studentName}</strong><br/>{b.enrollmentId}</td>
                            <td style={tdStyle}>{b.roomType} ({b.ac ? 'AC' : 'Non-AC'}) <br/><span style={{color: '#666', fontStyle: 'italic'}}>"{b.reason}"</span></td>
                            <td style={tdStyle}>{new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</td>
                            <td style={tdStyle}>
                                {selectedBooking === b._id ? (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <select value={chosenRoom} onChange={(e) => setChosenRoom(e.target.value)} style={{ padding: '5px' }}>
                                            <option value="">Select Room...</option>
                                            {availableRooms.map(r => <option key={r._id} value={r.roomNumber}>{r.roomNumber}</option>)}
                                        </select>
                                        <button onClick={confirmAssignment} style={{padding: '5px', backgroundColor: '#28a745', color:'white', border:'none', borderRadius:'3px', cursor:'pointer'}}>Confirm</button>
                                        <button onClick={() => setSelectedBooking(null)} style={{padding: '5px', backgroundColor: '#6c757d', color:'white', border:'none', borderRadius:'3px', cursor:'pointer'}}>Cancel</button>
                                    </div>
                                ) : (
                                    <div>
                                        <button onClick={() => handleApproveClick(b)} style={{padding: '5px 10px', backgroundColor: '#007bff', color:'white', border:'none', borderRadius:'3px', cursor:'pointer', marginRight:'5px'}}>✓ Approve</button>
                                        <button onClick={() => handleReject(b._id)} style={{padding: '5px 10px', backgroundColor: '#dc3545', color:'white', border:'none', borderRadius:'3px', cursor:'pointer'}}>✕ Reject</button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default FacultyDashboard;
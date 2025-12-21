import React from 'react';
import { Link } from 'react-router-dom';
import vnitBg from '../assets/vnit_bg.jpg'; 

const Home = () => {
    return (
        <div style={styles.container}>
            {/* HERO SECTION */}
            <div style={styles.hero}>
                <div style={styles.overlay}>
                    <h1 style={styles.title}>Welcome to VNIT Guest House</h1>
                    {/* ... rest of your JSX remains the same ... */}
                    <p style={styles.subtitle}>Experience comfort and hospitality in the heart of the campus.</p>
                    <div style={styles.buttonGroup}>
                        <Link to="/book" style={styles.primaryBtn}>📅 Book a Room</Link>
                        <Link to="/status" style={styles.secondaryBtn}>🔎 Check Status</Link>
                    </div>
                </div>
            </div>

            {/* ... Keep your About Section code here ... */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>About Us</h2>
                <p style={styles.text}>The Visvesvaraya National Institute of Technology (VNIT) Guest House provides...</p>
                {/* ... features ... */}
                 <div style={styles.features}>
                    <div style={styles.card}>
                        <h3>🛏️ Comfortable Rooms</h3>
                        <p>Well-furnished AC and Non-AC rooms available for Single and Double occupancy.</p>
                    </div>
                    <div style={styles.card}>
                        <h3>📶 Wi-Fi Enabled</h3>
                        <p>High-speed internet access available throughout the guest house premises.</p>
                    </div>
                    <div style={styles.card}>
                        <h3>🍽️ Dining Facility</h3>
                        <p>In-house canteen serving hygienic and delicious meals for guests.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal CSS
const styles = {
    container: { fontFamily: "'Segoe UI', sans-serif" },
    hero: {
        // --- UPDATED: Use the imported variable ---
        backgroundImage: `url(${vnitBg})`, 
        // ----------------------------------------
        height: '80vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center'
    },
    // ... keep all your other styles exactly the same ...
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        padding: '50px',
        borderRadius: '10px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: { fontSize: '3.5rem', marginBottom: '10px', fontWeight: 'bold' },
    subtitle: { fontSize: '1.5rem', marginBottom: '30px', fontWeight: '300' },
    buttonGroup: { display: 'flex', gap: '20px' },
    primaryBtn: { padding: '15px 30px', backgroundColor: '#f39c12', color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '5px', border: '2px solid #f39c12', transition: 'all 0.3s' },
    secondaryBtn: { padding: '15px 30px', backgroundColor: 'transparent', color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold', borderRadius: '5px', border: '2px solid white', transition: 'all 0.3s' },
    section: { padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' },
    sectionTitle: { fontSize: '2.5rem', color: '#2c3e50', marginBottom: '20px' },
    text: { fontSize: '1.1rem', color: '#555', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto 40px' },
    features: { display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' },
    card: { flex: '1', minWidth: '250px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: 'white' }
};

export default Home;
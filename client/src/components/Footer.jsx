import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                {/* Column 1: Logo & Info */}
                <div style={styles.column}>
                    <h3 style={styles.heading}>VNIT Guest House</h3>
                    <p style={styles.text}>
                        Providing comfortable and secure accommodation for guests, faculty, and official visitors of Visvesvaraya National Institute of Technology, Nagpur.
                    </p>
                </div>

                {/* Column 2: Quick Links */}
                <div style={styles.column}>
                    <h3 style={styles.heading}>Quick Links</h3>
                    <ul style={styles.list}>
                        <li><a href="https://vnit.ac.in" target="_blank" rel="noopener noreferrer" style={styles.link}>VNIT Main Website</a></li>
                        <li><a href="https://vnit.ac.in/academic/" target="_blank" rel="noopener noreferrer" style={styles.link}>Academic Calendar</a></li>
                        <li><a href="/status" style={styles.link}>Check Booking Status</a></li>
                        <li><a href="/login" style={styles.link}>Faculty Login</a></li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div style={styles.column}>
                    <h3 style={styles.heading}>Contact Us</h3>
                    <p style={styles.text}>📍 South Ambazari Road, Nagpur, Maharashtra - 440010</p>
                    <p style={styles.text}>📞 0712-2801301</p>
                    <p style={styles.text}>✉️ guesthouse@vnit.ac.in</p>
                </div>
            </div>
            
            <div style={styles.copyright}>
                <p>© {new Date().getFullYear()} VNIT Nagpur. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

// Internal CSS for Footer
const styles = {
    footer: {
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        padding: '40px 0 0 0',
        marginTop: 'auto', // Pushes footer to bottom
        fontFamily: "'Segoe UI', sans-serif"
    },
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px 40px'
    },
    column: {
        flex: '1',
        minWidth: '250px',
        margin: '10px 20px'
    },
    heading: {
        color: '#f39c12',
        marginBottom: '15px',
        borderBottom: '2px solid #f39c12',
        display: 'inline-block',
        paddingBottom: '5px'
    },
    text: {
        lineHeight: '1.6',
        fontSize: '0.95rem'
    },
    list: {
        listStyle: 'none',
        padding: 0
    },
    link: {
        color: '#ecf0f1',
        textDecoration: 'none',
        display: 'block',
        marginBottom: '10px',
        transition: 'color 0.3s'
    },
    copyright: {
        backgroundColor: '#1a252f',
        textAlign: 'center',
        padding: '15px',
        fontSize: '0.9rem',
        color: '#95a5a6'
    }
};

export default Footer;
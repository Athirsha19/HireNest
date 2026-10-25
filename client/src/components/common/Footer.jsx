import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      background: '#1f2937', 
      color: 'white', 
      padding: '40px 20px', 
      textAlign: 'center',
      marginTop: '60px'
    }}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} HireNest. All rights reserved.</p>
        <p style={{ marginTop: '10px', color: '#9ca3af' }}>
          Empowering migrant workers with technology
        </p>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
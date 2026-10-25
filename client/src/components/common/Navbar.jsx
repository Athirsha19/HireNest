import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout, role }) => {
  const getLinks = () => {
    switch (role) {
      case 'worker':
        return [
          { to: '/worker/dashboard', label: 'Dashboard' },
          { to: '/worker/jobs', label: 'Jobs' },
          { to: '/worker/applications', label: 'Applications' },
          { to: '/worker/profile', label: 'Profile' },
          { to: '/worker/grievance', label: 'Grievance' }
        ];
      case 'employer':
        return [
          { to: '/employer/dashboard', label: 'Dashboard' },
          { to: '/employer/post-job', label: 'Post Job' },
          { to: '/employer/jobs', label: 'My Jobs' },
          { to: '/employer/profile', label: 'Profile' },
          { to: '/employer/grievance', label: 'Grievance' }
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/workers/approvals', label: 'Worker Approvals' },
          { to: '/admin/employers/approvals', label: 'Employer Approvals' },
          { to: '/admin/users', label: 'Users' },
          { to: '/admin/jobs', label: 'Jobs' },
          { to: '/admin/complaints', label: 'Complaints' },
          { to: '/admin/reports', label: 'Reports' }
        ];
      default:
        return [];
    }
  };

  return (
    <nav style={{ 
      background: '#1f2937', 
      padding: '15px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Link to="/" style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#ff891a',
          textDecoration: 'none'
        }}>
          HireNest
        </Link>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {getLinks().map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              {link.label}
            </Link>
          ))}
          
          <div style={{ 
            borderLeft: '1px solid #4b5563', 
            paddingLeft: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{ color: 'white', fontSize: '14px' }}>{user?.name}</span>
            <button
              onClick={logout}
              className="btn btn-danger"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
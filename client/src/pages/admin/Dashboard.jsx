import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) return <div className="admin-loading">LOADING...</div>;

  return (
    <div className="admin-simple-root">
      <Navbar user={user} logout={logout} role="admin" />
      
      <main className="container">
        <header className="admin-simple-header">
          <h1 className="bebas">ADMIN_CONTROL</h1>
          <p>SYSTEM STATUS: <span className="orange-text">ACTIVE</span></p>
        </header>

        {/* 4 LARGE STAT BOXES */}
        <div className="stats-simple-grid">
          <div className="stat-box">
            <span className="label">TOTAL_WORKERS</span>
            <h2 className="bebas">{stats.totalWorkers}</h2>
            <div className="sub-label">PENDING: {stats.pendingWorkers}</div>
          </div>
          
          <div className="stat-box">
            <span className="label">TOTAL_EMPLOYERS</span>
            <h2 className="bebas">{stats.totalEmployers}</h2>
            <div className="sub-label">PENDING: {stats.pendingEmployers}</div>
          </div>

          <div className="stat-box">
            <span className="label">TOTAL_JOBS</span>
            <h2 className="bebas">{stats.totalJobs}</h2>
            <div className="sub-label">ACTIVE: {stats.activeJobs}</div>
          </div>

          <div className="stat-box alert">
            <span className="label">OPEN_GRIEVANCES</span>
            <h2 className="bebas">{stats.openGrievances}</h2>
          </div>
        </div>

        {/* 3 LARGE ACTION BUTTONS */}
        <div className="admin-actions-list">
          <Link to="/admin/workers" className="admin-btn">
            VERIFY WORKERS <span>→</span>
          </Link>
          <Link to="/admin/employers" className="admin-btn">
            VERIFY EMPLOYERS <span>→</span>
          </Link>
          <Link to="/admin/grievances" className="admin-btn orange-bg">
            MANAGE GRIEVANCES <span>→</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
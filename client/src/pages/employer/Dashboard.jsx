import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Plus, List, AlertTriangle, Building2, Briefcase, Activity, Users, ArrowUpRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await employerAPI.getDashboard();
      setDashboard(response.data);
    } catch (error) {
      toast.error('Failed to synchronize dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="employer-loading-screen">
      <div className="loader-bar"></div>
      <h2 className="bebas">LOADING_COMMAND_CENTER...</h2>
    </div>
  );

  return (
    <div className="employer-dashboard-root">
      <Navbar user={user} logout={logout} role="employer" />
      
      <main className="container dashboard-container">
        {/* --- HEADER --- */}
        <header className="dashboard-header-titan">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="system-path">TERMINAL // EMPLOYER_ROOT // {dashboard?.employer?.employerId}</div>
            <h1 className="bebas welcome-title">
              WELCOME, <span className="navy-text">{dashboard?.employer?.name}</span>
            </h1>
          </motion.div>

          <div className="company-badge">
            <Building2 size={20} />
            <div>
              <div className="company-label">ORGANIZATION</div>
              <div className="company-value">{dashboard?.employer?.companyName}</div>
            </div>
            <div className={`status-dot ${dashboard?.employer?.status}`}></div>
          </div>
        </header>

        {/* --- STATS MODULES --- */}
        <section className="stats-monolith-grid">
          {[
            { label: 'POSTED JOBS', val: dashboard?.stats?.postedJobs || 0, color: 'navy' },
            { label: 'ACTIVE NODES', val: dashboard?.stats?.activeJobs || 0, color: 'orange' },
            { label: 'APPLICATIONS', val: dashboard?.stats?.totalApplications || 0, color: 'navy' },
            { label: 'SELECTED FORCE', val: dashboard?.stats?.selectedWorkers || 0, color: 'orange' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.02 }}
              className={`stat-monolith-card ${stat.color}-theme`}
            >
              <span className="monolith-label">{stat.label}</span>
              <h2 className="bebas monolith-value">{stat.val}</h2>
              <div className="monolith-id">DATA_POINT_0{i+1}</div>
            </motion.div>
          ))}
        </section>

        <div className="dashboard-content-split">
          {/* --- LEFT: MANAGEMENT MODULE --- */}
          <section className="management-panel">
            <div className="panel-header-brutal">
               <Activity size={18} /> <span>CORE_MANAGEMENT</span>
            </div>
            <div className="action-links-stack">
              <Link to="/employer/post-job" className="action-link-btn primary-orange">
                <div className="btn-content">
                  <span className="bebas">POST NEW JOB</span>
                  <p>Deploy a new requirement to the grid</p>
                </div>
                <Plus size={30} />
              </Link>

              <Link to="/employer/jobs" className="action-link-btn secondary-navy">
                <div className="btn-content">
                  <span className="bebas">MANAGE JOBS</span>
                  <p>Monitor and update active listings</p>
                </div>
                <List size={24} />
              </Link>
              
              <Link to="/employer/grievance" className="action-link-btn danger-outline">
                <div className="btn-content">
                  <span className="bebas">REPORT CONFLICT</span>
                  <p>Initialize grievance protocol</p>
                </div>
                <AlertTriangle size={24} />
              </Link>
            </div>
          </section>

          {/* --- RIGHT: SYSTEM DATA --- */}
          <section className="system-data-panel">
             <div className="panel-header-brutal">
               <Briefcase size={18} /> <span>SYSTEM_STATUS</span>
             </div>
             <div className="data-box-white">
                <div className="data-row">
                  <span className="label">ACCOUNT_STATUS</span>
                  <span className={`value status-${dashboard?.employer?.status}`}>
                    {dashboard?.employer?.status?.toUpperCase()}
                  </span>
                </div>
                <div className="data-row">
                  <span className="label">EMPLOYER_SERIAL</span>
                  <span className="value">{dashboard?.employer?.employerId}</span>
                </div>
                <div className="data-row">
                  <span className="label">LOCATION</span>
                  <span className="value">{dashboard?.employer?.location?.district}, {dashboard?.employer?.location?.state}</span>
                </div>
                <div className="technical-divider"></div>
                <p className="tech-footer">ALL SYSTEMS OPERATIONAL // NO CONFLICTS DETECTED</p>
             </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
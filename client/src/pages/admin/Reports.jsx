import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, Users, BarChart, Zap } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './Reports.css';

const Reports = () => {
  const { user, logout } = useAuth();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await adminAPI.getReports();
      setReports(response.data.reports);
    } catch (error) {
      console.error("Error loading reports");
    }
  };

  if (!reports) return <div className="admin-loading">LOADING REPORTS...</div>;

  // Calculate simple percentages
  const successRate = reports.jobSuccessRate.total > 0 
    ? Math.round((reports.jobSuccessRate.completed / reports.jobSuccessRate.total) * 100) 
    : 0;

  const employmentRate = reports.workerEmploymentRate.total > 0 
    ? Math.round((reports.workerEmploymentRate.employed / reports.workerEmploymentRate.total) * 100) 
    : 0;

  return (
    <div className="admin-reports-root">
      <Navbar user={user} logout={logout} role="admin" />
      <div className="noise-bg"></div>

      <main className="container">
        <header className="admin-simple-header">
          <h1 className="bebas">ADMIN REPORTS</h1>
          <p>LATEST SYSTEM SUMMARY</p>
        </header>

        <div className="diagram-grid">
          
          {/* DIAGRAM 1: JOBS COMPLETED (Circle) */}
          <div className="diagram-card">
            <div className="card-label"><CheckCircle size={16}/> JOBS COMPLETED</div>
            <div className="circle-diagram">
              <svg viewBox="0 0 100 100">
                <circle className="bg" cx="50" cy="50" r="45" />
                <motion.circle 
                  initial={{ strokeDasharray: "0, 283" }}
                  animate={{ strokeDasharray: `${(successRate * 283) / 100}, 283` }}
                  transition={{ duration: 1.5 }}
                  className="fill-orange" cx="50" cy="50" r="45" 
                />
              </svg>
              <div className="circle-data">
                <h2 className="bebas">{successRate}%</h2>
                <span>SUCCESS</span>
              </div>
            </div>
            <div className="diag-footer">
              <span>TOTAL APPS: {reports.jobSuccessRate.total}</span>
              <span>COMPLETED: {reports.jobSuccessRate.completed}</span>
            </div>
          </div>

          {/* DIAGRAM 2: WORKERS AT WORK (Vertical Bar) */}
          <div className="diagram-card">
            <div className="card-label"><Users size={16}/> WORKERS AT WORK</div>
            <div className="bar-diagram-vertical">
               <div className="v-bar-bg">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${employmentRate}%` }}
                    transition={{ duration: 1.5 }}
                    className="v-bar-fill-navy"
                  ></motion.div>
               </div>
               <div className="v-bar-data">
                  <h2 className="bebas">{employmentRate}%</h2>
                  <p>HIRING RATE</p>
               </div>
            </div>
            <div className="diag-footer">
               <span>TOTAL WORKERS: {reports.workerEmploymentRate.total}</span>
               <span>EMPLOYED: {reports.workerEmploymentRate.employed}</span>
            </div>
          </div>

          {/* DIAGRAM 3: TOP SKILLS (Horizontal Bars) */}
          <div className="diagram-card wide">
            <div className="card-label"><Zap size={16}/> MOST NEEDED SKILLS</div>
            <div className="skills-matrix">
              {reports.topSkills.map((skill, idx) => (
                <div key={idx} className="matrix-row">
                  <div className="matrix-info">
                    <span className="skill-name">{skill._id.toUpperCase()}</span>
                    <span className="skill-count">{skill.count} JOBS</span>
                  </div>
                  <div className="matrix-bar-bg">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(skill.count / reports.topSkills[0].count) * 100}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className="matrix-bar-fill"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Reports;
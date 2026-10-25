import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Terminal, Activity, MapPin, Users, 
  Briefcase, XCircle, ShieldAlert, Database,
  ArrowUpRight
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './Jobs.css';

const Jobs = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllJobs();
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error('NETWORK_SYNC_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (jobId) => {
    if (window.confirm('PROTOCOL_OVERRIDE: TERMINATE_JOB_NODE?')) {
      try {
        await adminAPI.disableJob(jobId);
        toast.success('NODE_DEACTIVATED_SUCCESS');
        fetchJobs();
      } catch (error) {
        toast.error('OVERRIDE_FAILED');
      }
    }
  };

  return (
    <div className="admin-jobs-root">
      <Navbar user={user} logout={logout} role="admin" />
      <div className="noise-bg"></div>

      <main className="container">
        {/* --- SYSTEM HUD --- */}
        <header className="admin-simple-header">
          <div className="header-left">
            <h1 className="bebas">SYSTEM_MONITOR</h1>
            <p className="tech-sub"><Terminal size={14} /> LIVE_DEPLOYMENT_FEED</p>
          </div>
          <div className="header-stats">
            <div className="h-stat">
              <span className="label">ACTIVE_NODES</span>
              <span className="value">{jobs.filter(j => j.status === 'active').length}</span>
            </div>
            <div className="h-stat">
              <span className="label">TOTAL_LOGS</span>
              <span className="value">{jobs.length}</span>
            </div>
          </div>
        </header>

        {/* --- JOBS FEED --- */}
        <div className="admin-jobs-list">
          {loading ? (
            <div className="loader-simple">SCANNING_GLOBAL_DATABASE...</div>
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className={`job-log-card ${job.status}`}>
                <div className="card-side-status">
                   <div className="status-dot"></div>
                </div>

                <div className="card-main">
                  <div className="card-row-top">
                    <div className="job-info">
                      <span className="employer-tag">{job.employer?.companyName || 'UNKNOWN_ENTITY'}</span>
                      <h3 className="bebas">{job.title}</h3>
                    </div>
                    <div className={`status-badge-brutal ${job.status}`}>
                       {job.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="card-data-grid">
                    <div className="data-item">
                      <MapPin size={14}/> <span>REGION:</span> {job.location.district.toUpperCase()}
                    </div>
                    <div className="data-item">
                      <Users size={14}/> <span>TRAFFIC:</span> {job.applicationsCount} APPS
                    </div>
                    <div className="data-item">
                      <Database size={14}/> <span>SERIAL:</span> {job._id.slice(-8).toUpperCase()}
                    </div>
                  </div>

                  <div className="card-actions-admin">
                    {job.status === 'active' ? (
                      <button onClick={() => handleDisable(job._id)} className="btn-terminate">
                        TERMINATE_NODE <XCircle size={16}/>
                      </button>
                    ) : (
                      <div className="archived-label">NODE_INACTIVE</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-simple">
              <Briefcase size={60} opacity={0.1}/>
              <h3 className="bebas">NO_DEPLOYMENTS_FOUND</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Jobs;
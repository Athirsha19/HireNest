import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { employerAPI, jobAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Briefcase, Users, IndianRupee, Edit3, 
  XCircle, Eye, ArrowLeft, Settings, 
  Activity, Database, Save, X 
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './ManageJobs.css';

const ManageJobs = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', wageAmount: '', vacancies: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await employerAPI.getJobs();
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error('DATABASE_SYNC_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (jobId) => {
    if (window.confirm('TERMINATE_JOB_NODE?')) {
      try {
        await jobAPI.closeJob(jobId);
        toast.success('NODE_DEACTIVATED');
        fetchJobs();
      } catch (error) {
        toast.error('TERMINATION_FAILED');
      }
    }
  };

  const handleEditClick = (job) => {
    setSelectedJobId(job._id);
    setFormData({
      title: job.title,
      description: job.description,
      wageAmount: typeof job.wage === 'object' ? job.wage.amount : job.wage,
      vacancies: job.vacancies
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      description: formData.description,
      wage: { amount: Number(formData.wageAmount), type: 'fixed' },
      vacancies: Number(formData.vacancies)
    };

    try {
      await jobAPI.updateJob(selectedJobId, payload);
      toast.success('NODE_RECALIBRATED_SUCCESSFULLY');
      setIsEditing(false);
      fetchJobs();
    } catch (error) {
      toast.error('UPDATE_COMMIT_FAILED');
    }
  };

  if (loading) return <div className="titan-loader">SCANNING_ACTIVE_NODES...</div>;

  return (
    <div className="manage-jobs-root">
      <Navbar user={user} logout={logout} role="employer" />
      <div className="noise-bg"></div>

      <main className="container manage-container">
        {/* --- HEADER --- */}
        <header className="terminal-header">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <h1 className="bebas title-large">MANAGEMENT_STREAM</h1>
             <p className="tech-sub"><Database size={12}/> ACTIVE_DEPLOYMENT_LOGS</p>
          </motion.div>
          <Link to="/employer/post-job" className="btn-titan initialize">
             INITIALIZE_NEW_NODE
          </Link>
        </header>

        {/* --- JOB NODES LIST --- */}
        <div className="nodes-stream">
          {jobs.length === 0 ? (
            <div className="empty-node-state">
              <Briefcase size={60} opacity={0.1} />
              <p className="bebas">NO_ACTIVE_DEPLOYMENTS</p>
            </div>
          ) : (
            jobs.map((job, idx) => (
              <motion.div 
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`job-node-card ${job.status}`}
              >
                <div className="node-top">
                  <div className="node-identity">
                    <span className="node-id-tag">NODE_SERIAL: {job._id.slice(-6).toUpperCase()}</span>
                    <h3>{job.title}</h3>
                  </div>
                  <div className={`node-status-badge ${job.status}`}>
                    <Activity size={12} /> {job.status.toUpperCase()}
                  </div>
                </div>

                <p className="node-description">{job.description}</p>
                
                <div className="node-meta-grid">
                  <div className="meta-item">
                    <Users size={14}/> <span>APPLICANTS:</span> <strong>{job.applicationsCount}</strong>
                  </div>
                  <div className="meta-item">
                    <IndianRupee size={14}/> <span>WAGE:</span> <strong>₹{typeof job.wage === 'object' ? job.wage.amount : job.wage}</strong>
                  </div>
                  <div className="meta-item">
                    <Settings size={14}/> <span>CAPACITY:</span> <strong>{job.vacancies}</strong>
                  </div>
                </div>
                
                <div className="node-controls">
                  <Link to={`/employer/jobs/${job._id}/applicants`} className="btn-control primary">
                    <Eye size={16} /> VIEW_PERSONNEL
                  </Link>
                  
                  {job.status === 'active' && (
                    <div className="control-group">
                      <button onClick={() => handleEditClick(job)} className="btn-control secondary">
                        <Edit3 size={16} /> RECALIBRATE
                      </button>
                      <button onClick={() => handleClose(job._id)} className="btn-control danger">
                        <XCircle size={16} /> TERMINATE
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* --- EDIT MODAL (COMMAND OVERRIDE) --- */}
        <AnimatePresence>
          {isEditing && (
            <div className="modal-overlay-titan">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="monolith-modal"
              >
                <div className="modal-header-brutal">
                  <h2 className="bebas">COMMAND_OVERRIDE: EDIT_NODE</h2>
                  <button onClick={() => setIsEditing(false)} className="close-x"><X /></button>
                </div>
                
                <form onSubmit={handleUpdate} className="titan-form">
                  <div className="input-field-titan">
                    <label>NODE_TITLE</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="input-field-titan">
                    <label>NODE_DESCRIPTION</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required />
                  </div>
                  <div className="grid-2">
                    <div className="input-field-titan">
                      <label>WAGE_VALUE (₹)</label>
                      <input type="number" name="wageAmount" value={formData.wageAmount} onChange={handleInputChange} required />
                    </div>
                    <div className="input-field-titan">
                      <label>VACANCY_SLOTS</label>
                      <input type="number" name="vacancies" value={formData.vacancies} onChange={handleInputChange} required />
                    </div>
                  </div>
                  
                  <div className="modal-actions-titan">
                    <button type="submit" className="btn-titan initialize full">COMMIT_CHANGES <Save size={18}/></button>
                    <button type="button" className="btn-titan abort full" onClick={() => setIsEditing(false)}>ABORT_ACTION</button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ManageJobs;
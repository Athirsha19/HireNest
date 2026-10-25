import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { employerAPI, applicationAPI, ratingAPI, jobAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  User, Star, CheckCircle, XCircle, 
  Search, ArrowLeft, ShieldCheck, MessageSquare,
  Activity, Zap, MapPin, Phone
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './Applicants.css';

const Applicants = () => {
  const { user, logout } = useAuth();
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [ratingData, setRatingData] = useState({ 
    applicationId: null, workerName: '', rating: 5, feedback: '' 
  });

  useEffect(() => { fetchData(); }, [jobId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobRes, appRes] = await Promise.all([
        jobAPI.getJob(jobId),
        employerAPI.getJobApplications(jobId)
      ]);
      setJobDetails(jobRes.data.job);
      setApplications(appRes.data.applications);
    } catch (error) {
      toast.error('System Data Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await applicationAPI.updateStatus(applicationId, status);
      toast.success(`Protocol: ${status.toUpperCase()} Success`);
      fetchData();
    } catch (error) {
      toast.error('Update Failed');
    }
  };

  const handleRateWorker = async () => {
    if (!ratingData.feedback) return toast.warning("Detailed feedback required");
    try {
      await ratingAPI.rate({
        applicationId: ratingData.applicationId,
        rating: ratingData.rating,
        feedback: ratingData.feedback
      });
      toast.success('Reputation Updated');
      setRatingData({ applicationId: null, workerName: '', rating: 5, feedback: '' });
      fetchData(); 
    } catch (error) {
      toast.error('Protocol Error');
    }
  };

  if (loading) return <div className="titan-loader">SYNCING_PERSONNEL_FILES...</div>;

  return (
    <div className="applicants-root">
      <Navbar user={user} logout={logout} role="employer" />
      <div className="noise-bg"></div>

      <main className="container applicants-container">
        {/* --- HEADER HUD --- */}
        <header className="terminal-header">
          <button onClick={() => navigate(-1)} className="back-link-titan">
            <ArrowLeft size={16} /> BACK_TO_DASHBOARD
          </button>
          <div className="header-main-box">
            <h1 className="bebas">APPLICANT_STREAM // <span className="orange-text">{jobDetails?.title}</span></h1>
            <div className={`status-badge-brutal ${jobDetails?.status}`}>
              {jobDetails?.status?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* --- APPLICANTS LIST --- */}
        <section className="personnel-grid">
          {applications.length === 0 ? (
            <div className="empty-terminal-card">
              <Search size={60} opacity={0.1} />
              <p className="bebas">NO_PERSONNEL_LOGS_FOUND</p>
            </div>
          ) : (
            applications.map(app => (
              <motion.div 
                key={app._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="personnel-card"
              >
                <div className="card-top">
                  <div className="worker-identity">
                    <h3 onClick={() => setSelectedWorker(app.worker)}>{app.worker?.name}</h3>
                    <div className="rep-score">
                      <Star size={14} fill="#FF5F00" color="#FF5F00" />
                      <span>REPUTATION: {app.worker?.rating?.average?.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className={`app-status-tag ${app.status}`}>
                    {app.status.toUpperCase()}
                  </div>
                </div>

                <div className="card-controls">
                  {jobDetails?.status === 'active' && app.status === 'applied' ? (
                    <div className="action-button-group">
                      <button onClick={() => handleStatusUpdate(app._id, 'selected')} className="btn-titan accept">ACCEPT_UNIT</button>
                      <button onClick={() => handleStatusUpdate(app._id, 'rejected')} className="btn-titan reject">REJECT</button>
                    </div>
                  ) : (
                    <div className="post-action-box">
                      {jobDetails?.status === 'closed' && app.status === 'selected' ? (
                        app.isRated ? (
                          <div className="rated-status"><ShieldCheck size={16}/> RATING_COMMITTED</div>
                        ) : (
                          <button 
                            onClick={() => setRatingData({ ...ratingData, applicationId: app._id, workerName: app.worker.name })} 
                            className="btn-titan rate"
                          >
                            ⭐ RATE_WORKER
                          </button>
                        )
                      ) : (
                        <button onClick={() => setSelectedWorker(app.worker)} className="view-profile-link">
                          VIEW_PROFILE <ArrowLeft className="rotate-icon" size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </section>

        {/* --- MODALS (INTELLIGENCE PROFILES) --- */}
        <AnimatePresence>
          {selectedWorker && (
            <div className="modal-overlay-titan">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="modal-card-brutal"
              >
                <div className="modal-header-brutal">
                  <h2 className="bebas">PERSONNEL_FILE: {selectedWorker.name}</h2>
                  <button onClick={() => setSelectedWorker(null)} className="close-btn-titan"><XCircle /></button>
                </div>
                <div className="modal-body">
                  <div className="intel-row"><Phone size={16}/> <span>MOBILE:</span> {selectedWorker.mobile}</div>
                  <div className="intel-row"><Zap size={16}/> <span>SKILLS:</span> {selectedWorker.skills?.join(' // ')}</div>
                  <div className="intel-row"><MapPin size={16}/> <span>GEOGRAPHY:</span> {selectedWorker.location?.area}, {selectedWorker.location?.district}</div>
                  <div className="barcode-visual"></div>
                </div>
              </motion.div>
            </div>
          )}

          {ratingData.applicationId && (
            <div className="modal-overlay-titan">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="modal-card-brutal small"
              >
                <div className="modal-header-brutal">
                  <h2 className="bebas">COMMIT_REPUTATION: {ratingData.workerName}</h2>
                </div>
                <div className="modal-body">
                  <div className="titan-input-group">
                    <label>RATING_VALUE (1-5)</label>
                    <input type="number" min="1" max="5" value={ratingData.rating} 
                      onChange={(e) => setRatingData({ ...ratingData, rating: parseInt(e.target.value) })} />
                  </div>
                  <div className="titan-input-group">
                    <label>MISSION_FEEDBACK</label>
                    <textarea rows="4" value={ratingData.feedback}
                      onChange={(e) => setRatingData({ ...ratingData, feedback: e.target.value })} 
                      placeholder="Performance details..." />
                  </div>
                  <div className="modal-actions-titan">
                    <button onClick={handleRateWorker} className="btn-titan accept">COMMIT</button>
                    <button onClick={() => setRatingData({ applicationId: null })} className="btn-titan reject">ABORT</button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Applicants;
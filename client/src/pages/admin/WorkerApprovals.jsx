import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, FileText, MapPin, 
  User, Mail, Phone, Zap, ExternalLink, Terminal 
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './WorkerApprovals.css';

const WorkerApprovals = () => {
  const { user, logout } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingWorkers();
  }, []);

  const fetchPendingWorkers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingWorkers();
      setWorkers(response.data.workers);
    } catch (error) {
      toast.error('IDENTIFICATION_SYNC_FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (workerId, action) => {
    const reason = action === 'reject' ? prompt('REASON_FOR_REJECTION:') : null;
    if (action === 'reject' && reason === null) return;

    try {
      await adminAPI.verifyWorker(workerId, action, reason);
      toast.success(`UNIT_${action.toUpperCase()}_SUCCESS`);
      fetchPendingWorkers();
    } catch (error) {
      toast.error('CLEARANCE_PROTOCOL_FAILED');
    }
  };

  return (
    <div className="admin-approvals-root">
      <Navbar user={user} logout={logout} role="admin" />
      <div className="noise-bg"></div>

      <main className="container">
        {/* --- HUD HEADER --- */}
        <header className="admin-simple-header">
          <div className="header-left">
            <h1 className="bebas">IDENTITY_CLEARANCE</h1>
            <p className="tech-sub"><Terminal size={14} /> PENDING_PERSONNEL: <span className="orange-text">{workers.length}</span></p>
          </div>
        </header>

        {/* --- WORKER REGISTRY STREAM --- */}
        <div className="approvals-list">
          {loading ? (
            <div className="loader-simple">SCANNING_PENDING_UNITS...</div>
          ) : workers.length > 0 ? (
            <AnimatePresence>
              {workers.map((worker, idx) => (
                <motion.div 
                  key={worker._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="approval-card"
                >
                  <div className="card-side-tag">PENDING_AUTH</div>

                  <div className="card-body">
                    <div className="body-header">
                      <div className="u-name">
                        <h2 className="bebas">{worker.name}</h2>
                        <span className="serial-num">SN_{worker._id.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="id-type-badge">
                        {worker.governmentId.type.toUpperCase()}
                      </div>
                    </div>

                    <div className="intel-grid">
                      <div className="intel-col">
                        <label>COMMUNICATION_LINES</label>
                        <p><Mail size={12}/> {worker.email}</p>
                        <p><Phone size={12}/> {worker.mobile}</p>
                      </div>
                      <div className="intel-col">
                        <label>SKILL_DNA</label>
                        <div className="skill-tags">
                          {worker.skills.map((s, i) => <span key={i} className="s-tag">{s}</span>)}
                        </div>
                      </div>
                      <div className="intel-col">
                        <label>GEOSPATIAL_DATA</label>
                        <p><MapPin size={12}/> {worker.location.district}, {worker.location.state}</p>
                        <p className="area-txt">{worker.location.area}</p>
                      </div>
                    </div>

                    <div className="action-footer">
                      <div className="doc-section">
                        {worker.governmentId.document && (
                          <a href={`http://localhost:5000/${worker.governmentId.document}`} target="_blank" rel="noopener noreferrer" className="btn-doc">
                            <FileText size={16}/> VIEW_GOVT_ID <ExternalLink size={12}/>
                          </a>
                        )}
                      </div>
                      <div className="btn-group">
                        <button onClick={() => handleVerify(worker._id, 'approve')} className="verify-btn approve">
                          APPROVE_UNIT <ShieldCheck size={18}/>
                        </button>
                        <button onClick={() => handleVerify(worker._id, 'reject')} className="verify-btn reject">
                          REJECT <ShieldAlert size={18}/>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="empty-state-simple">
              <User size={60} opacity={0.1} />
              <h3 className="bebas">ALL_UNITS_CLEARED</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkerApprovals;
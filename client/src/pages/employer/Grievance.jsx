import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { grievanceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  AlertTriangle, Send, Paperclip, ShieldAlert, 
  MessageSquare, Clock, CheckCircle, XCircle, 
  Plus, ArrowLeft, Activity, Terminal
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './Grievance.css';

const Grievance = () => {
  const { user, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'payment',
    subject: '',
    description: '',
    attachments: []
  });

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const response = await grievanceAPI.getMy();
      setGrievances(response.data.grievances);
    } catch (error) {
      toast.error('CONNECTION_SYNC_FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? Array.from(files) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('category', formData.category);
    data.append('subject', formData.subject);
    data.append('description', formData.description);
    formData.attachments.forEach(file => data.append('attachments', file));

    try {
      await grievanceAPI.submit(data);
      toast.success('CONFLICT_REPORT_TRANSMITTED');
      setShowForm(false);
      setFormData({ category: 'payment', subject: '', description: '', attachments: [] });
      fetchGrievances();
    } catch (error) {
      toast.error('TRANSMISSION_ERROR');
    }
  };

  const getStatusConfig = (status) => {
    const map = {
      open: { color: '#6b7280', icon: <Clock size={14}/>, label: 'OPEN' },
      in_progress: { color: '#FF5F00', icon: <Activity size={14}/>, label: 'IN_SCAN' },
      resolved: { color: '#10b981', icon: <CheckCircle size={14}/>, label: 'RESOLVED' },
      closed: { color: '#121F3A', icon: <XCircle size={14}/>, label: 'ARCHIVED' }
    };
    return map[status] || map.open;
  };

  return (
    <div className="grievance-root">
      <Navbar user={user} logout={logout} role="employer" />
      <div className="noise-bg"></div>

      <main className="container grievance-container">
        {/* --- TERMINAL HEADER --- */}
        <header className="terminal-header">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <h1 className="bebas title-large">CONFLICT_LOGS</h1>
             <p className="tech-sub"><Terminal size={12}/> SYSTEM_ADMIN_REPORTING_UNIT</p>
          </motion.div>
          
          <button 
            onClick={() => setShowForm(!showForm)} 
            className={`btn-titan ${showForm ? 'abort' : 'initialize'}`}
          >
            {showForm ? <><ArrowLeft size={18}/> ABORT_REPORT</> : <><Plus size={18}/> INITIALIZE_REPORT</>}
          </button>
        </header>

        <AnimatePresence mode="wait">
          {showForm ? (
            <motion.section 
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="monolith-form-box"
            >
              <div className="form-head-brutal">TRANSMISSION_TERMINAL</div>
              <form onSubmit={handleSubmit}>
                <div className="grid-2">
                  <div className="input-field-titan">
                    <label>CONFLICT_CATEGORY</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                      <option value="payment">Payment Issue</option>
                      <option value="harassment">Harassment</option>
                      <option value="working_conditions">Working Conditions</option>
                      <option value="contract_violation">Contract Violation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="input-field-titan">
                    <label>SUBJECT_LINE</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Brief title" />
                  </div>
                </div>

                <div className="input-field-titan">
                  <label>DETAILED_LOG_DESCRIPTION</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Document the discrepancy..." />
                </div>

                <div className="file-upload-titan">
                  <label><Paperclip size={18}/> ATTACH_EVIDENCE (IMG/PDF)</label>
                  <input type="file" name="attachments" onChange={handleChange} accept="image/*,.pdf" multiple />
                </div>

                <button type="submit" className="transmit-btn-titan">
                  TRANSMIT_CONFLICT_REPORT <Send size={20}/>
                </button>
              </form>
            </motion.section>
          ) : (
            <motion.section 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="log-stream"
            >
              {loading ? (
                <div className="system-loader-titan">SCANNING_LOG_DATABASE...</div>
              ) : grievances.length > 0 ? (
                grievances.map((g, idx) => {
                  const status = getStatusConfig(g.status);
                  const priorityColor = { high: '#ef4444', medium: '#FF5F00', low: '#10b981' }[g.priority];
                  
                  return (
                    <motion.div 
                      key={g._id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="log-entry-card" 
                      style={{ borderLeft: `6px solid ${priorityColor}` }}
                    >
                      <div className="log-card-top">
                        <div className="log-identity">
                          <span className="cat-tag">{g.category.toUpperCase()}</span>
                          <h3>{g.subject}</h3>
                        </div>
                        <div className="status-badge-titan" style={{ color: status.color, borderColor: status.color }}>
                          {status.icon} {status.label}
                        </div>
                      </div>

                      <p className="log-body-text">{g.description}</p>

                      <div className="log-meta-footer">
                        <div className="meta-info">
                          <span className="priority-tag" style={{ color: priorityColor }}>PRIORITY: {g.priority.toUpperCase()}</span>
                          <span className="timestamp">LOGGED: {new Date(g.createdAt).toLocaleDateString()}</span>
                        </div>
                        {g.attachments?.length > 0 && (
                          <div className="attachment-indicator"><Paperclip size={14}/> {g.attachments.length} DATA_FILES</div>
                        )}
                      </div>

                      {g.adminNotes && (
                        <div className="admin-intel-box">
                          <div className="intel-label"><ShieldAlert size={14}/> ADMIN_RESPONSE:</div>
                          <p>"{g.adminNotes}"</p>
                          {g.resolvedAt && <div className="resolve-stamp">✓ DE-ESCALATED: {new Date(g.resolvedAt).toLocaleDateString()}</div>}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="empty-terminal-state">
                  <AlertTriangle size={80} opacity={0.05}/>
                  <h3 className="bebas">NO_CONFLICTS_IN_DATABASE</h3>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Grievance;
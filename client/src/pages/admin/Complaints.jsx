import React, { useState, useEffect } from 'react';
import { grievanceAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { X, Terminal, ChevronRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './Complaints.css';

const Complaints = () => {
  const { user, logout } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', priority: '', adminNotes: '' });

  useEffect(() => { fetchGrievances(); }, []);

  const fetchGrievances = async () => {
    try {
      const response = await grievanceAPI.getAll();
      setGrievances(response.data.grievances);
    } catch (error) {
      toast.error('DATABASE_SYNC_ERROR');
    }
  };

  const openManageModal = (g) => {
    setSelectedGrievance(g);
    setEditForm({ status: g.status, priority: g.priority, adminNotes: g.adminNotes || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await grievanceAPI.updateStatus(selectedGrievance._id, editForm);
      toast.success('LEDGER_UPDATED');
      setSelectedGrievance(null);
      fetchGrievances();
    } catch (error) {
      toast.error('UPDATE_FAILED');
    }
  };

  return (
    <div className="admin-complaints-root">
      <Navbar user={user} logout={logout} role="admin" />
      
      <main className="container">
        <header className="admin-simple-header">
          <h1 className="bebas">CONFLICT_MANAGEMENT</h1>
          <p><Terminal size={14} /> ACTIVE_DISPUTES: <span className="orange-text">{grievances.length}</span></p>
        </header>

        <div className="complaints-list">
          {grievances.map(g => (
            <div key={g._id} className={`complaint-card ${g.priority === 'high' ? 'high-priority' : ''}`}>
              <div className="card-side-label">{g.userRole.toUpperCase()}</div>
              
              <div className="card-main-content">
                <div className="card-header-row">
                  <h3 className="bebas">{g.subject}</h3>
                  <div className={`status-pill ${g.status}`}>{g.status.replace('_', ' ').toUpperCase()}</div>
                </div>
                
                <div className="card-meta">
                  <span>USER: <strong>{g.user?.name}</strong></span>
                  <span>CATEGORY: <strong>{g.category.toUpperCase()}</strong></span>
                </div>

                <p className="description-text">{g.description}</p>
                
                <button onClick={() => openManageModal(g)} className="manage-btn-simple">
                  MANAGE_CONFLICT <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BRUTALIST MODAL */}
        {selectedGrievance && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-box">
              <div className="modal-header-simple">
                <h2 className="bebas">OVERRIDE_PROTOCOL</h2>
                <button onClick={() => setSelectedGrievance(null)} className="close-x"><X /></button>
              </div>

              <form onSubmit={handleUpdate}>
                <div className="input-group-simple">
                  <label>SET_STATUS</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                    <option value="open">OPEN</option>
                    <option value="in_progress">IN_PROGRESS</option>
                    <option value="resolved">RESOLVED</option>
                    <option value="closed">CLOSED</option>
                  </select>
                </div>

                <div className="input-group-simple">
                  <label>SET_PRIORITY</label>
                  <select value={editForm.priority} onChange={(e) => setEditForm({...editForm, priority: e.target.value})}>
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>

                <div className="input-group-simple">
                  <label>ADMIN_RESPONSE_LOG</label>
                  <textarea 
                    rows="4" 
                    value={editForm.adminNotes}
                    onChange={(e) => setEditForm({...editForm, adminNotes: e.target.value})}
                    placeholder="Enter official resolution notes..."
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="commit-btn">COMMIT_CHANGES</button>
                  <button type="button" onClick={() => setSelectedGrievance(null)} className="abort-btn">ABORT</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Complaints;
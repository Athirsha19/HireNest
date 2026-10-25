import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Check, X, ExternalLink, Building, 
  Mail, Phone, MapPin, FileText, Terminal 
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './EmployerApprovals.css';

const EmployerApprovals = () => {
  const { user, logout } = useAuth();
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingEmployers();
  }, []);

  const fetchPendingEmployers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getPendingEmployers();
      setEmployers(response.data.employers);
    } catch (error) {
      toast.error('DATABASE_SYNC_ERROR');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (employerId, action) => {
    const reason = action === 'reject' ? prompt('Enter reason for rejection:') : null;
    if (action === 'reject' && reason === null) return; // Abort if user cancels prompt

    try {
      await adminAPI.verifyEmployer(employerId, action, reason);
      toast.success(`ENTITY_${action.toUpperCase()}_SUCCESS`);
      fetchPendingEmployers();
    } catch (error) {
      toast.error('VERIFICATION_PROTOCOL_FAILED');
    }
  };

  return (
    <div className="admin-approvals-root">
      <Navbar user={user} logout={logout} role="admin" />
      
      <main className="container">
        <header className="admin-simple-header">
          <h1 className="bebas">ENTITY_VERIFICATION</h1>
          <p><Terminal size={14} /> PENDING_APPROVALS: <span className="orange-text">{employers.length}</span></p>
        </header>

        <div className="approvals-list">
          {loading ? (
            <div className="loader-simple">SCANNING_FOR_PENDING_ENTITIES...</div>
          ) : employers.length > 0 ? (
            employers.map(employer => (
              <div key={employer._id} className="approval-card">
                <div className="card-side-bar">PENDING</div>
                
                <div className="card-content">
                  <div className="content-header">
                    <h2 className="bebas">{employer.companyName}</h2>
                    <span className="id-stamp">ID: {employer._id.slice(-6).toUpperCase()}</span>
                  </div>

                  <div className="info-grid-simple">
                    <div className="info-col">
                      <label>REPRESENTATIVE</label>
                      <p><User size={14}/> {employer.name}</p>
                      <p><Mail size={14}/> {employer.email}</p>
                      <p><Phone size={14}/> {employer.mobile}</p>
                    </div>
                    <div className="info-col">
                      <label>GEOSPATIAL_DATA</label>
                      <p><MapPin size={14}/> {employer.companyAddress}</p>
                      <p className="area-tag">{employer.location.area}, {employer.location.district}, {employer.location.state}</p>
                    </div>
                  </div>

                  <div className="docs-row">
                    <label>ATTACHED_PROTOCOLS:</label>
                    <div className="doc-links">
                      {employer.documents.license && (
                        <a href={`http://localhost:5000/${employer.documents.license}`} target="_blank" rel="noopener noreferrer" className="doc-btn">
                          VIEW_LICENSE <ExternalLink size={14}/>
                        </a>
                      )}
                      {employer.documents.registration && (
                        <a href={`http://localhost:5000/${employer.documents.registration}`} target="_blank" rel="noopener noreferrer" className="doc-btn">
                          VIEW_REGISTRATION <ExternalLink size={14}/>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="action-row">
                    <button onClick={() => handleVerify(employer._id, 'approve')} className="verify-btn approve">
                      APPROVE_ENTITY <Check size={18}/>
                    </button>
                    <button onClick={() => handleVerify(employer._id, 'reject')} className="verify-btn reject">
                      REJECT <X size={18}/>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-simple">
              <Building size={60} opacity={0.1} />
              <h3 className="bebas">NO_PENDING_REGISTRATIONS</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Internal icon component for cleaner code
const User = ({size}) => <Building size={size} style={{marginRight: '8px', verticalAlign: 'middle', opacity: 0.5}}/>;

export default EmployerApprovals;
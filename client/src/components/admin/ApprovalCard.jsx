import React from 'react';

const ApprovalCard = ({ user, type, onApprove, onReject }) => {
  const handleApprove = () => {
    if (window.confirm(`Approve ${user.name}?`)) {
      onApprove(user._id);
    }
  };

  const handleReject = () => {
    const reason = prompt('Reason for rejection:');
    if (reason) {
      onReject(user._id, reason);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>
            {type === 'worker' ? user.name : user.companyName}
          </h3>
          
          {type === 'employer' && (
            <p style={{ color: '#6b7280', marginBottom: '10px' }}>
              Contact Person: {user.name}
            </p>
          )}

          <div style={{ marginBottom: '15px' }}>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Mobile:</strong> {user.mobile}</p>
          </div>

          {type === 'worker' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <strong>Skills:</strong>
                <div style={{ marginTop: '5px' }}>
                  {user.skills?.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="badge" 
                      style={{ background: '#dbeafe', color: '#1e40af', marginRight: '5px' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <p><strong>Location:</strong> {user.location?.area}, {user.location?.district}, {user.location?.state}</p>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <p><strong>ID Type:</strong> {user.governmentId?.type}</p>
                {user.governmentId?.document && (
                  <a 
                    href={`http://localhost:5000/${user.governmentId.document}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#3b82f6', textDecoration: 'none' }}
                  >
                    📄 View Document
                  </a>
                )}
              </div>
            </>
          )}

          {type === 'employer' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <p><strong>Address:</strong> {user.companyAddress}</p>
                <p><strong>Location:</strong> {user.location?.area}, {user.location?.district}, {user.location?.state}</p>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <strong>Documents:</strong>
                <div style={{ marginTop: '5px' }}>
                  {user.documents?.license && (
                    <a 
                      href={`http://localhost:5000/${user.documents.license}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', marginRight: '15px', textDecoration: 'none' }}
                    >
                      📄 View License
                    </a>
                  )}
                  {user.documents?.registration && (
                    <a 
                      href={`http://localhost:5000/${user.documents.registration}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', textDecoration: 'none' }}
                    >
                      📄 View Registration
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: '10px' }}>
            <span className="badge badge-pending">PENDING APPROVAL</span>
            <span style={{ marginLeft: '10px', color: '#6b7280', fontSize: '14px' }}>
              Registered: {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginLeft: '20px' }}>
          <button 
            onClick={handleApprove} 
            className="btn btn-success"
            style={{ minWidth: '120px' }}
          >
            ✓ Approve
          </button>
          <button 
            onClick={handleReject} 
            className="btn btn-danger"
            style={{ minWidth: '120px' }}
          >
            ✗ Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;

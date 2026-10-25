import React from 'react';

const ApplicationCard = ({ application, onMarkComplete }) => {
  const getStatusColor = (status) => {
    const colors = {
      applied: 'badge-pending',
      selected: 'badge-active',
      rejected: 'badge-rejected',
      completed: 'badge-completed'
    };
    return colors[status] || 'badge-pending';
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ color: '#3b82f6', marginBottom: '5px' }}>{application.job?.title}</h3>
        <p style={{ color: '#6b7280' }}>{application.employer?.companyName}</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <span>📍 {application.job?.location.district}, {application.job?.location.state}</span>
        <span>💰 ₹{application.job?.wage.amount}/{application.job?.wage.type}</span>
        <span>📅 Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className={`badge ${getStatusColor(application.status)}`}>
            {application.status.toUpperCase()}
          </span>
          {application.selectedAt && (
            <span style={{ marginLeft: '10px', color: '#6b7280', fontSize: '14px' }}>
              Selected on: {new Date(application.selectedAt).toLocaleDateString()}
            </span>
          )}
          {application.workerMarkedComplete && !application.employerConfirmedComplete && (
            <span style={{ marginLeft: '10px', color: '#f59e0b', fontSize: '14px' }}>
              ⏳ Awaiting employer confirmation
            </span>
          )}
        </div>

        {application.status === 'selected' && !application.workerMarkedComplete && onMarkComplete && (
          <button
            onClick={() => onMarkComplete(application._id)}
            className="btn btn-success"
          >
            Mark as Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;

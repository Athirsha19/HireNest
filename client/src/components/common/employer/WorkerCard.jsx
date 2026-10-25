import React from 'react';

const WorkerCard = ({ worker, onSelect, showMatchScore = false, matchScore = 0 }) => {
  return (
    <div className="card" style={{ marginBottom: '15px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <h3 style={{ color: '#3b82f6', margin: 0 }}>{worker.name}</h3>
            {worker.workerId && (
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                ID: {worker.workerId}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong style={{ fontSize: '14px', color: '#374151' }}>Skills:</strong>
            <div style={{ marginTop: '5px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {worker.skills?.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="badge" 
                  style={{ background: '#dbeafe', color: '#1e40af' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              📍 {worker.location?.area}, {worker.location?.district}, {worker.location?.state}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                {worker.rating?.average?.toFixed(1) || '0.0'} ⭐
              </span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {worker.rating?.count || 0} reviews
              </div>
            </div>

            <div>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                {worker.completedJobs || 0}
              </span>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Completed Jobs
              </div>
            </div>
          </div>

          <div style={{ marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
            <div>📧 {worker.email}</div>
            <div>📱 {worker.mobile}</div>
          </div>

          <div style={{ marginTop: '10px' }}>
            <span className={`badge badge-${worker.status}`}>
              {worker.status?.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginLeft: '20px' }}>
          {showMatchScore && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: matchScore >= 70 ? '#10b981' : matchScore >= 50 ? '#f59e0b' : '#6b7280'
              }}>
                {matchScore}%
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Match Score</div>
            </div>
          )}

          {onSelect && (
            <button
              onClick={() => onSelect(worker._id)}
              className="btn btn-primary"
              style={{ minWidth: '120px' }}
            >
              Select Worker
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
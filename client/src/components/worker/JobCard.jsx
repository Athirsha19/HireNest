import React from 'react';
import { applicationAPI } from '../../services/api';
import { toast } from 'react-toastify';

const JobCard = ({ job, onApply }) => {
  const handleApply = async () => {
    try {
      await applicationAPI.apply(job._id);
      toast.success('Application submitted successfully!');
      if (onApply) onApply();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>{job.title}</h3>
          <p style={{ color: '#6b7280', marginBottom: '15px' }}>{job.employer?.companyName}</p>
          
          <div style={{ marginBottom: '15px' }}>
            <p style={{ color: '#374151' }}>{job.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }}>
            <span>📍 {job.location.district}, {job.location.state}</span>
            <span>💰 ₹{job.wage.amount}/{job.wage.type}</span>
            <span>📅 {job.duration.value} {job.duration.unit}</span>
            <span>👥 {job.vacancies} positions</span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Required Skills:</strong>
            <div style={{ marginTop: '5px' }}>
              {job.skills.map((skill, idx) => (
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

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className={`badge badge-${job.status}`}>{job.status}</span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>
              {job.applicationsCount} applications
            </span>
          </div>
        </div>

        <div>
          <button
            onClick={handleApply}
            className="btn btn-primary"
            disabled={job.status !== 'active'}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

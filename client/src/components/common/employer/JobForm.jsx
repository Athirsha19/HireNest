import React, { useState } from 'react';
import { toast } from 'react-toastify';

const JobForm = ({ onSubmit, initialData = null, submitText = 'Post Job' }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    skills: initialData?.skills?.join(', ') || '',
    state: initialData?.location?.state || '',
    district: initialData?.location?.district || '',
    area: initialData?.location?.area || '',
    wageAmount: initialData?.wage?.amount || '',
    wageType: initialData?.wage?.type || 'daily',
    durationValue: initialData?.duration?.value || '',
    durationUnit: initialData?.duration?.unit || 'days',
    vacancies: initialData?.vacancies || 1
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Job title is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Job description is required');
      return;
    }

    if (!formData.skills.trim()) {
      toast.error('Skills are required');
      return;
    }

    const jobData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      location: {
        state: formData.state.trim(),
        district: formData.district.trim(),
        area: formData.area.trim()
      },
      wage: {
        amount: parseInt(formData.wageAmount),
        type: formData.wageType
      },
      duration: {
        value: parseInt(formData.durationValue),
        unit: formData.durationUnit
      },
      vacancies: parseInt(formData.vacancies)
    };

    setLoading(true);
    await onSubmit(jobData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Job Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Construction Worker, Plumber, Driver"
          required
        />
      </div>

      <div className="form-group">
        <label>Job Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="5"
          placeholder="Describe the job responsibilities, requirements, and working conditions"
          required
        />
      </div>

      <div className="form-group">
        <label>Required Skills * (comma separated)</label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g., Construction, Masonry, Welding"
          required
        />
        <small style={{ color: '#6b7280', fontSize: '12px' }}>
          Separate multiple skills with commas
        </small>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '15px', color: '#374151' }}>Job Location</h4>
        <div className="grid grid-3">
          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
            />
          </div>

          <div className="form-group">
            <label>District *</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="Enter district"
              required
            />
          </div>

          <div className="form-group">
            <label>Area *</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Enter area/locality"
              required
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '15px', color: '#374151' }}>Wage Details</h4>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Wage Amount (₹) *</label>
            <input
              type="number"
              name="wageAmount"
              value={formData.wageAmount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Wage Type *</label>
            <select
              name="wageType"
              value={formData.wageType}
              onChange={handleChange}
              required
            >
              <option value="hourly">Per Hour</option>
              <option value="daily">Per Day</option>
              <option value="monthly">Per Month</option>
              <option value="fixed">Fixed (Total)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ marginBottom: '15px', color: '#374151' }}>Job Duration</h4>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Duration *</label>
            <input
              type="number"
              name="durationValue"
              value={formData.durationValue}
              onChange={handleChange}
              placeholder="Enter duration"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Duration Unit *</label>
            <select
              name="durationUnit"
              value={formData.durationUnit}
              onChange={handleChange}
              required
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Number of Vacancies *</label>
        <input
          type="number"
          name="vacancies"
          value={formData.vacancies}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: '20px' }}
        disabled={loading}
      >
        {loading ? 'Processing...' : submitText}
      </button>
    </form>
  );
};

export default JobForm;

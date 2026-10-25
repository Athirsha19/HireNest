import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jobAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Plus, ArrowLeft, Briefcase, MapPin, 
  IndianRupee, Clock, Users, ShieldCheck 
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './PostJob.css';

const PostJob = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', skills: '', state: '', district: '', area: '',
    wageAmount: '', wageType: 'daily', durationValue: '', durationUnit: 'days', vacancies: 1
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      title: formData.title, description: formData.description,
      skills: formData.skills.split(',').map(s => s.trim()),
      location: { state: formData.state, district: formData.district, area: formData.area },
      wage: { amount: parseInt(formData.wageAmount), type: formData.wageType },
      duration: { value: parseInt(formData.durationValue), unit: formData.durationUnit },
      vacancies: parseInt(formData.vacancies)
    };

    try {
      await jobAPI.createJob(data);
      toast.success('DEPLOIMENT_SUCCESSFUL');
      navigate('/employer/jobs');
    } catch (error) {
      toast.error('DEPLOYMENT_FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-root">
      <Navbar user={user} logout={logout} role="employer" />
      
      <div className="container" style={{ marginTop: '40px', maxWidth: '1000px' }}>
        <button onClick={() => navigate(-1)} className="back-btn-titan">
          <ArrowLeft size={16} /> BACK_TO_DASHBOARD
        </button>

        <header className="post-header-titan">
          <h1 className="bebas">INITIALIZE_DEPLOYMENT</h1>
          <p className="tech-sub">PROTOCOL_v2.0 // NEW_JOB_POSTING</p>
        </header>

        <div className="monolith-form-wrapper">
          <form onSubmit={handleSubmit}>
            {/* --- SECTION 1: CORE DATA --- */}
            <div className="form-section-titan">
              <div className="section-label-titan"><Briefcase size={16}/> CORE_INFORMATION</div>
              <div className="input-field-titan">
                <label>JOB TITLE *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Senior Mason / Project Lead" />
              </div>
              <div className="input-field-titan">
                <label>DESCRIPTION *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Detail the scope of work..." />
              </div>
              <div className="input-field-titan">
                <label>REQUIRED SKILLS * (COMMA SEPARATED)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="Welding, Carpentry, Management" />
              </div>
            </div>

            {/* --- SECTION 2: GEOGRAPHY --- */}
            <div className="form-section-titan">
              <div className="section-label-titan"><MapPin size={16}/> GEOSPATIAL_LOCATION</div>
              <div className="grid-3">
                <div className="input-field-titan"><label>STATE *</label><input type="text" name="state" value={formData.state} onChange={handleChange} required /></div>
                <div className="input-field-titan"><label>DISTRICT *</label><input type="text" name="district" value={formData.district} onChange={handleChange} required /></div>
                <div className="input-field-titan"><label>AREA *</label><input type="text" name="area" value={formData.area} onChange={handleChange} required /></div>
              </div>
            </div>

            {/* --- SECTION 3: COMPENSATION --- */}
            <div className="form-section-titan">
              <div className="section-label-titan"><IndianRupee size={16}/> COMPENSATION_MODEL</div>
              <div className="grid-2">
                <div className="input-field-titan"><label>WAGE AMOUNT *</label><input type="number" name="wageAmount" value={formData.wageAmount} onChange={handleChange} required /></div>
                <div className="input-field-titan">
                  <label>WAGE TYPE *</label>
                  <select name="wageType" value={formData.wageType} onChange={handleChange} className="titan-select">
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- SECTION 4: TIMELINE & CAPACITY --- */}
            <div className="form-section-titan">
              <div className="section-label-titan"><Clock size={16}/> DEPLOYMENT_TIMELINE</div>
              <div className="grid-2">
                <div className="input-field-titan"><label>DURATION *</label><input type="number" name="durationValue" value={formData.durationValue} onChange={handleChange} required /></div>
                <div className="input-field-titan">
                  <label>UNIT *</label>
                  <select name="durationUnit" value={formData.durationUnit} onChange={handleChange} className="titan-select">
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <div className="input-field-titan" style={{ marginTop: '20px' }}>
                <label><Users size={16}/> VACANCIES *</label>
                <input type="number" name="vacancies" value={formData.vacancies} onChange={handleChange} required min="1" />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="submit-btn-titan"
              disabled={loading}
            >
              {loading ? 'UPLOADING_DATA...' : <><Plus size={20}/> INITIALIZE_JOB_POSTING</>}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
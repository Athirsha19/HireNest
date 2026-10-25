import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { employerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  Building2, User, Mail, Phone, MapPin, 
  ShieldCheck, Edit3, Save, X, Camera, 
  Activity, Barcode, ArrowLeft, Briefcase, Users
} from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', mobile: '', companyName: '', companyAddress: '', 
    state: '', district: '', area: '', profilePicture: null
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await employerAPI.getProfile();
      const emp = response.data.employer;
      setProfile(emp);
      setFormData({
        name: emp.name,
        mobile: emp.mobile,
        companyName: emp.companyName,
        companyAddress: emp.companyAddress,
        state: emp.location.state,
        district: emp.location.district,
        area: emp.location.area,
        profilePicture: null
      });
    } catch (error) {
      toast.error('IDENTITY_SYNC_FAILED');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('mobile', formData.mobile);
    data.append('companyName', formData.companyName);
    data.append('companyAddress', formData.companyAddress);
    data.append('location', JSON.stringify({
      state: formData.state,
      district: formData.district,
      area: formData.area
    }));
    if (formData.profilePicture) {
      data.append('profilePicture', formData.profilePicture);
    }

    try {
      await employerAPI.updateProfile(data);
      toast.success('LEDGER_UPDATED_SUCCESSFULLY');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error('COMMIT_FAILED');
    }
  };

  if (loading) return <div className="titan-loader">SCANNING_ENTITY_DATA...</div>;

  return (
    <div className="profile-root">
      <Navbar user={user} logout={logout} role="employer" />
      <div className="noise-bg"></div>

      <main className="container profile-container">
        <header className="terminal-header">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
             <h1 className="bebas title-xl">ENTITY_PROFILE</h1>
             <p className="tech-sub">CORPORATE_DATA_LEDGER // ACCESS_LEVEL: ADMIN</p>
          </motion.div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-titan initialize">
              <Edit3 size={18} /> EDIT_IDENTITY
            </button>
          )}
        </header>

        <AnimatePresence mode="wait">
          {!editing ? (
            <motion.div 
              key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="profile-layout-grid"
            >
              {/* LEFT: CORPORATE ID CARD */}
              <div className="identity-monolith">
                <div className="profile-pic-frame">
                  <img 
                    src={profile.profilePicture || `https://ui-avatars.com/api/?name=${profile.companyName}&background=121F3A&color=fff`} 
                    alt="Corporate" 
                  />
                  <div className={`status-seal ${profile.status}`}>
                    {profile.status === 'verified' ? <ShieldCheck size={20}/> : <Activity size={20}/>}
                  </div>
                </div>
                
                <div className="identity-content">
                  <h2 className="bebas">{profile.companyName}</h2>
                  <div className="serial-number"><Barcode size={14}/> {profile.employerId}</div>
                  
                  <div className="contact-lines">
                    <div className="line"><User size={14}/> {profile.name}</div>
                    <div className="line"><Mail size={14}/> {profile.email}</div>
                    <div className="line"><Phone size={14}/> {profile.mobile}</div>
                  </div>
                </div>

                <div className="id-footer">
                  <div className="f-label">AUTH_STATUS</div>
                  <div className={`f-value ${profile.status}`}>{profile.status.toUpperCase()}</div>
                </div>
              </div>

              {/* RIGHT: SYSTEM PANELS */}
              <div className="data-panel-stack">
                <div className="brutal-panel">
                  <h3 className="panel-head">OUTPUT_STATISTICS</h3>
                  <div className="stats-row-titan">
                    <div className="unit">
                      <div className="val bebas">{profile.postedJobs || 0}</div>
                      <div className="lab">JOBS_POSTED</div>
                    </div>
                    <div className="unit">
                      <div className="val bebas">{profile.selectedWorkers || 0}</div>
                      <div className="lab">FORCE_SELECTED</div>
                    </div>
                  </div>
                </div>

                <div className="panel-grid-2">
                  <div className="brutal-panel">
                    <h3 className="panel-head">GEOSPATIAL_DATA</h3>
                    <div className="loc-info">
                      <MapPin size={20} className="orange-text"/>
                      <p>{profile.location.area}<br/>{profile.location.district}, {profile.location.state}</p>
                    </div>
                  </div>
                  <div className="brutal-panel">
                    <h3 className="panel-head">PHYSICAL_ADDRESS</h3>
                    <p className="addr-text">{profile.companyAddress}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="edit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="monolith-edit-box"
            >
              <form onSubmit={handleSubmit} className="titan-form">
                <div className="form-head-brutal bebas">MODIFY_IDENTITY_DATA</div>
                
                <div className="grid-2">
                  <div className="input-field-titan"><label>REPRESENTATIVE NAME</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                  <div className="input-field-titan"><label>CONTACT MOBILE</label><input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required /></div>
                </div>

                <div className="input-field-titan"><label>COMPANY LEGAL NAME</label><input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required /></div>
                <div className="input-field-titan"><label>COMPANY PHYSICAL ADDRESS</label><textarea name="companyAddress" value={formData.companyAddress} onChange={handleChange} required rows="3" /></div>

                <div className="grid-3">
                  <div className="input-field-titan"><label>STATE</label><input type="text" name="state" value={formData.state} onChange={handleChange} required /></div>
                  <div className="input-field-titan"><label>DISTRICT</label><input type="text" name="district" value={formData.district} onChange={handleChange} required /></div>
                  <div className="input-field-titan"><label>AREA</label><input type="text" name="area" value={formData.area} onChange={handleChange} required /></div>
                </div>

                <div className="input-field-titan">
                  <label>UPDATE CORPORATE LOGO</label>
                  <div className="file-upload-brutal">
                    <Camera size={20}/>
                    <input type="file" name="profilePicture" onChange={handleChange} accept="image/*" />
                  </div>
                </div>

                <div className="form-actions-brutal">
                  <button type="submit" className="btn-titan initialize"><Save size={18}/> COMMIT_CHANGES</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-titan abort"><X size={18}/> ABORT_EDIT</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Profile;
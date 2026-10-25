import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, User, Mail, 
  Phone, Lock, MapPin, Briefcase, FileText, Languages, Activity 
} from 'lucide-react';
import './RegisterWorker.css';

const RegisterWorker = () => {
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();
  const { registerWorker } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', password: '', confirmPassword: '',
    skills: '', state: '', district: '', area: '',
    idType: 'aadhaar', idNumber: '', idDocument: null
  });

  // --- CONTENT DICTIONARY ---
  const content = {
    en: {
      req_h: "WORKER PROTOCOL",
      req_1: "Government Issued ID (Aadhaar/Voter)",
      req_2: "Verified Skill Certification",
      req_3: "Active Communication Line",
      back: "BACK TO TERMINAL",
      form_h: "WORKER ONBOARDING",
      form_sub: "Register your professional profile to match with global employers.",
      sec1: "PERSONAL IDENTITY",
      sec2: "SKILLSET MAPPING",
      sec3: "GEOSPATIAL LOCATION",
      sec4: "IDENTITY VERIFICATION",
      label_name: "FULL NAME",
      label_mail: "EMAIL ADDRESS",
      label_mob: "MOBILE NUMBER",
      label_pass: "ACCESS KEY",
      label_cpass: "CONFIRM ACCESS KEY",
      label_skills: "SKILLS (COMMA SEPARATED)",
      label_idtype: "GOVERNMENT ID TYPE",
      label_idnum: "ID NUMBER",
      btn_reg: "INITIALIZE PROTOCOL",
      btn_loading: "ENCRYPTING PROFILE...",
      footer_q: "ALREADY REGISTERED?",
      login: "LOGIN"
    },
    ta: {
      req_h: "தொழிலாளர் நெறிமுறை",
      req_1: "அரசு அடையாள அட்டை (ஆதார்/வாக்காளர்)",
      req_2: "சரிபார்க்கப்பட்ட திறன் சான்று",
      req_3: "செயலில் உள்ள தொடர்பு எண்",
      back: "முகப்பு பக்கத்திற்கு",
      form_h: "தொழிலாளர் பதிவு",
      form_sub: "உலகளாவிய முதலாளிகளுடன் இணைய உங்கள் தொழில்முறை விவரங்களை பதிவு செய்யவும்.",
      sec1: "தனிப்பட்ட விவரங்கள்",
      sec2: "திறன் விவரங்கள்",
      sec3: "இருப்பிட விவரங்கள்",
      sec4: "அடையாள சரிபார்ப்பு",
      label_name: "முழு பெயர்",
      label_mail: "மின்னஞ்சல் முகவரி",
      label_mob: "கைபேசி எண்",
      label_pass: "அணுகல் கடவுச்சொல்",
      label_cpass: "கடவுச்சொல்லை உறுதிப்படுத்து",
      label_skills: "திறன்கள் (காற்புள்ளியால் பிரிக்கப்பட வேண்டும்)",
      label_idtype: "அரசு அடையாள வகை",
      label_idnum: "அடையாள எண்",
      btn_reg: "பதிவைத் தொடங்கு",
      btn_loading: "விவரங்கள் சேமிக்கப்படுகிறது...",
      footer_q: "ஏற்கனவே கணக்கு உள்ளதா?",
      login: "உள்நுழைக"
    }
  };

  const t = content[lang];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error(lang === 'en' ? 'Passwords do not match' : 'கடவுச்சொற்கள் பொருந்தவில்லை');
      return;
    }
    if (!formData.idDocument) {
      toast.error(lang === 'en' ? 'Upload Government ID' : 'அடையாள அட்டையை பதிவேற்றவும்');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('mobile', formData.mobile);
    data.append('password', formData.password);
    data.append('skills', JSON.stringify(formData.skills.split(',').map(s => s.trim())));
    data.append('location', JSON.stringify({ state: formData.state, district: formData.district, area: formData.area }));
    data.append('governmentId', JSON.stringify({ type: formData.idType, number: formData.idNumber }));
    data.append('governmentId', formData.idDocument);

    const result = await registerWorker(data);
    if (result.success) {
      toast.success(result.message);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="register-titan-container">
      <div className="noise-bg"></div>

      {/* SIDEBAR */}
      <div className="register-sidebar">
        <div className="sidebar-content">
          <div className="brand-header">HireNest<span className="orange-dot">.</span></div>
          
          <div className="lang-switcher-reg">
            <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="lang-btn-auth">
              <Languages size={14} />
              <span>{lang === 'en' ? 'TAMIL' : 'ENGLISH'}</span>
            </button>
          </div>

          <div className="requisites-box">
            <h3 className="bebas">{t.req_h}</h3>
            <ul>
              <li><Activity size={14} className="orange-text"/> {t.req_1}</li>
              <li><Activity size={14} className="orange-text"/> {t.req_2}</li>
              <li><Activity size={14} className="orange-text"/> {t.req_3}</li>
            </ul>
          </div>

          <div className="sidebar-footer">
             <div className="status-code">NODE_STATUS: STANDBY</div>
             <div className="status-code">USER_ROLE: WORKER_ENTITY</div>
          </div>
        </div>
      </div>

      {/* FORM AREA */}
      <div className="register-form-area">
        <div className="form-max-width">
          <Link to="/" className="back-nav"><ArrowLeft size={16}/> {t.back}</Link>
          
          <header className="reg-header">
            <h1 className="bebas">{t.form_h}</h1>
            <p>{t.form_sub}</p>
          </header>

          <form onSubmit={handleSubmit} className="titan-reg-form">
            
            {/* SECTION 1: PERSONAL */}
            <div className="form-section">
              <div className="section-title"><User size={18}/> {t.sec1}</div>
              <div className="grid-2">
                <div className="input-field">
                  <label>{t.label_name} *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                </div>
                <div className="input-field">
                  <label>{t.label_mail} *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="worker@core.com" />
                </div>
              </div>
              <div className="grid-2">
                <div className="input-field">
                  <label>{t.label_mob} *</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required pattern="[0-9]{10}" placeholder="0000000000" />
                </div>
              </div>
              <div className="grid-2">
                <div className="input-field">
                  <label>{t.label_pass} *</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
                </div>
                <div className="input-field">
                  <label>{t.label_cpass} *</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* SECTION 2: SKILLS */}
            <div className="form-section">
              <div className="section-title"><Briefcase size={18}/> {t.sec2}</div>
              <div className="input-field">
                <label>{t.label_skills} *</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="Construction, Plumbing, Farming..." />
              </div>
            </div>

            {/* SECTION 3: LOCATION */}
            <div className="form-section">
              <div className="section-title"><MapPin size={18}/> {t.sec3}</div>
              <div className="grid-3">
                <div className="input-field">
                  <label>STATE *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                </div>
                <div className="input-field">
                  <label>DISTRICT *</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} required />
                </div>
                <div className="input-field">
                  <label>AREA *</label>
                  <input type="text" name="area" value={formData.area} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* SECTION 4: ID VERIFICATION */}
            <div className="form-section">
              <div className="section-title"><ShieldCheck size={18}/> {t.sec4}</div>
              <div className="grid-2">
                <div className="input-field">
                  <label>{t.label_idtype} *</label>
                  <select name="idType" value={formData.idType} onChange={handleChange} required className="titan-select">
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="voter_id">Voter ID</option>
                  </select>
                </div>
                <div className="input-field">
                  <label>{t.label_idnum} *</label>
                  <input type="text" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="Enter ID number" />
                </div>
              </div>
              <div className="file-upload-box full-width">
                  <label><FileText size={14}/> UPLOAD GOVERNMENT ID (IMAGE/PDF) *</label>
                  <input type="file" name="idDocument" onChange={handleChange} accept="image/*,.pdf" required />
              </div>
            </div>

            <button type="submit" className="reg-submit-btn" disabled={loading}>
              {loading ? t.btn_loading : <>{t.btn_reg} <ShieldCheck size={20}/></>}
            </button>
          </form>

          <footer className="reg-form-footer">
            <p>{t.footer_q} <Link to="/login" className="orange-text">{t.login}</Link></p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RegisterWorker;
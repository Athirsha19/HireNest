import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldCheck, Building, User, Mail, 
  Phone, Lock, MapPin, FileText, Languages, Activity 
} from 'lucide-react';
import './RegisterEmployer.css';

const RegisterEmployer = () => {
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();
  const { registerEmployer } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', password: '', confirmPassword: '',
    companyName: '', companyAddress: '', state: '', district: '', area: '',
    license: null, registration: null
  });

  // --- CONTENT DICTIONARY ---
  const content = {
    en: {
      req_h: "DEPLOYMENT REQUISITES",
      req_1: "Valid Business License (PDF/IMG)",
      req_2: "Company Registration Proof",
      req_3: "Verified Contact Protocols",
      back: "BACK TO TERMINAL",
      form_h: "EMPLOYER ONBOARDING",
      form_sub: "Initialize your corporate profile to access the global talent pool.",
      sec1: "PERSONAL IDENTITY",
      sec2: "CORPORATE DATA",
      sec3: "GEOSPATIAL LOCATION",
      sec4: "DOCUMENT UPLOAD",
      label_name: "FULL NAME",
      label_mail: "EMAIL ADDRESS",
      label_mob: "MOBILE NUMBER",
      label_pass: "ACCESS KEY",
      label_cpass: "CONFIRM ACCESS KEY",
      label_cname: "COMPANY LEGAL NAME",
      label_caddr: "COMPANY PHYSICAL ADDRESS",
      btn_reg: "INITIALIZE DEPLOYMENT",
      btn_loading: "ENCRYPTING DATA...",
      footer_q: "ALREADY REGISTERED?",
      login: "LOGIN"
    },
    ta: {
      req_h: "தேவைப்படும் ஆவணங்கள்",
      req_1: "வணிக உரிமம் (PDF/IMG)",
      req_2: "நிறுவன பதிவு சான்று",
      req_3: "சரிபார்க்கப்பட்ட தொடர்பு எண்",
      back: "முகப்பு பக்கத்திற்கு",
      form_h: "முதலாளி பதிவு",
      form_sub: "உலகளாவிய திறமையாளர்களை அணுக உங்கள் நிறுவன விவரங்களை உள்ளிடவும்.",
      sec1: "தனிப்பட்ட விவரங்கள்",
      sec2: "நிறுவன தரவு",
      sec3: "இருப்பிட விவரங்கள்",
      sec4: "ஆவணப் பதிவேற்றம்",
      label_name: "முழு பெயர்",
      label_mail: "மின்னஞ்சல் முகவரி",
      label_mob: "கைபேசி எண்",
      label_pass: "அணுகல் கடவுச்சொல்",
      label_cpass: "கடவுச்சொல்லை உறுதிப்படுத்து",
      label_cname: "நிறுவனத்தின் சட்டப்பூர்வ பெயர்",
      label_caddr: "நிறுவனத்தின் முகவரி",
      btn_reg: "பதிவை தொடங்கு",
      btn_loading: "தரவு சேமிக்கப்படுகிறது...",
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
    if (!formData.license || !formData.registration) {
      toast.error(lang === 'en' ? 'Upload all documents' : 'அனைத்து ஆவணங்களையும் பதிவேற்றவும்');
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('mobile', formData.mobile);
    data.append('password', formData.password);
    data.append('companyName', formData.companyName);
    data.append('companyAddress', formData.companyAddress);
    data.append('location', JSON.stringify({ state: formData.state, district: formData.district, area: formData.area }));
    data.append('license', formData.license);
    data.append('registration', formData.registration);

    const result = await registerEmployer(data);
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

      {/* STICKY LEFT SIDE */}
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
             <div className="status-code">SYSTEM_PROTOCOL: ACTIVE</div>
             <div className="status-code">ENCRYPTION: AES_256</div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE FORM SIDE */}
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
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="input-field">
                  <label>{t.label_mail} *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid-2">
                <div className="input-field">
                  <label>{t.label_mob} *</label>
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required pattern="[0-9]{10}" />
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

            {/* SECTION 2: COMPANY */}
            <div className="form-section">
              <div className="section-title"><Building size={18}/> {t.sec2}</div>
              <div className="input-field">
                <label>{t.label_cname} *</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
              </div>
              <div className="input-field">
                <label>{t.label_caddr} *</label>
                <textarea name="companyAddress" value={formData.companyAddress} onChange={handleChange} required rows="3" />
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

            {/* SECTION 4: DOCUMENTS */}
            <div className="form-section">
              <div className="section-title"><FileText size={18}/> {t.sec4}</div>
              <div className="grid-2">
                <div className="file-upload-box">
                  <label>LICENSE DOCUMENT *</label>
                  <input type="file" name="license" onChange={handleChange} accept="image/*,.pdf" required />
                </div>
                <div className="file-upload-box">
                  <label>REGISTRATION PROOF *</label>
                  <input type="file" name="registration" onChange={handleChange} accept="image/*,.pdf" required />
                </div>
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

export default RegisterEmployer;
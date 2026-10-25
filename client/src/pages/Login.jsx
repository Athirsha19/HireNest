import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, Mail, Activity, Languages } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [lang, setLang] = useState('en'); // Language State
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // --- CONTENT DICTIONARY ---
  const content = {
    en: {
      visual_h1: "SECURE",
      visual_h2: "SYSTEM",
      visual_h3: "ACCESS",
      data_conn: "ENCRYPTED_CONNECTION: ACTIVE",
      data_prot: "SECURITY_PROTOCOL: v2.0",
      back: "BACK TO TERMINAL",
      form_h: "IDENTIFICATION",
      form_sub: "Please enter your credentials to access the global labor grid.",
      label_mail: "EMAIL ADDRESS",
      label_pass: "ACCESS KEY",
      btn_login: "INITIALIZE ACCESS",
      btn_loading: "AUTHENTICATING...",
      footer_q: "UNREGISTERED ENTITY?",
      reg_w: "REGISTER AS WORKER",
      reg_e: "REGISTER AS EMPLOYER"
    },
    ta: {
      visual_h1: "பாதுகாப்பான",
      visual_h2: "கணினி",
      visual_h3: "அணுகல்",
      data_conn: "மறைக்கப்பட்ட இணைப்பு: செயலில் உள்ளது",
      data_prot: "பாதுகாப்பு நெறிமுறை: v2.0",
      back: "முகப்பு பக்கத்திற்கு",
      form_h: "அடையாளம் காணுதல்",
      form_sub: "உலகளாவிய தொழிலாளர் வலையமைப்பை அணுக உங்கள் விவரங்களை உள்ளிடவும்.",
      label_mail: "மின்னஞ்சல் முகவரி",
      label_pass: "அணுகல் விசை",
      btn_login: "அணுகலைத் தொடங்கு",
      btn_loading: "சரிபார்க்கப்படுகிறது...",
      footer_q: "பதிவு செய்யவில்லையா?",
      reg_w: "தொழிலாளராக பதிவு செய்க",
      reg_e: "முதலாளியாக பதிவு செய்க"
    }
  };

  const t = content[lang];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);
    if (result.success) {
      toast.success(lang === 'en' ? 'System Access Granted' : 'அணுகல் அனுமதிக்கப்பட்டது');
      switch (result.user.role) {
        case 'worker': navigate('/worker/dashboard'); break;
        case 'employer': navigate('/employer/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    } else {
      toast.error(result.message || 'Access Denied');
    }
    setLoading(false);
  };

  return (
    <div className="login-split-container">
      <div className="noise-overlay"></div>

      {/* LANGUAGE TOGGLE - Fixed Top Right of the form side */}
      <div className="lang-switcher-login">
        <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="lang-btn-auth">
          <Languages size={14} />
          <span>{lang === 'en' ? 'TAMIL' : 'ENGLISH'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={lang}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.3 }}
          className="login-full-wrapper"
        >
          {/* LEFT SIDE: VISUAL */}
          <div className="login-visual-side">
            <div className="visual-overlay"></div>
            <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070" alt="Tech" className="bg-image" />
            <div className="visual-content">
              <div className="brand-logo">HireNest<span className="orange-dot">.</span></div>
              <h2 className="bebas display-text">
                {t.visual_h1} <br /> 
                <span className="orange-text">{t.visual_h2}</span> <br /> 
                {t.visual_h3}
              </h2>
              <div className="realtime-data-box">
                <div className="data-row"><Activity size={14} className="orange-text" /><span>{t.data_conn}</span></div>
                <div className="data-row"><ShieldCheck size={14} className="orange-text" /><span>{t.data_prot}</span></div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: FORM */}
          <div className="login-form-side">
            <div className="form-wrapper">
              <Link to="/" className="back-link"><ArrowLeft size={16} /> {t.back}</Link>
              <div className="form-header">
                <h1 className="bebas">{t.form_h}</h1>
                <p>{t.form_sub}</p>
              </div>

              <form onSubmit={handleSubmit} className="titan-form">
                <div className="input-group">
                  <label><Mail size={14} /> {t.label_mail}</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="user@system_core.com" />
                </div>
                <div className="input-group">
                  <label><Lock size={14} /> {t.label_pass}</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                </div>
                <button type="submit" className="login-submit-btn" disabled={loading}>
                  {loading ? <span className="loading-shimmer">{t.btn_loading}</span> : <>{t.btn_login} <ShieldCheck size={20} /></>}
                </button>
              </form>

              <div className="form-footer">
                <p>{t.footer_q}</p>
                <div className="register-links">
                  <Link to="/register/worker" className="reg-link">{t.reg_w}</Link>
                  <div className="vertical-divider"></div>
                  <Link to="/register/employer" className="reg-link">{t.reg_e}</Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
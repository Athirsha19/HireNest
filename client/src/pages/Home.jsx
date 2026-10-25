import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  ArrowUpRight, Cpu, ShieldCheck, MessageSquare, Zap, 
  BarChart3, Clock, Globe, Fingerprint, Layers, Activity, Languages, ChevronRight 
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const [lang, setLang] = useState('en'); 
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- CONTENT DICTIONARY (English & Tamil) ---
  const content = {
    en: {
      portal: "ACCESS PORTAL",
      h1_1: "THE GLOBAL",
      h1_2: "PROTOCOL",
      h1_3: "FOR LABOR.",
      hero_desc: "HireNest is the decentralized engine driving the next generation of workforce mobility. AI-vetted. Secure. Transparent.",
      btn_w: "FIND WORK",
      btn_e: "HIRE TALENT",
      stats_p: "PAYOUTS",
      stats_w: "WORKERS",
      ticker: " // SYSTEM STATUS: OPTIMAL // NEW JOB IN SINGAPORE // ID VERIFIED // ",
      prot_h: "THE PROTOCOL",
      step1_t: "Identity Vetting",
      step1_d: "Biometric and legal verification through global databases.",
      step2_t: "Neural Matching",
      step2_d: "AI maps your skill DNA to high-yield opportunities.",
      step3_t: "Deployment",
      step3_d: "Smart-contracts secure your travel and salary instantly.",
      feat_h: "CORE SYSTEM",
      bento1_t: "AI Neural Core",
      bento1_d: "Processing 1.2M matches per second.",
      bento2_t: "Live Earnings",
      bento2_d: "Track every cent in real-time.",
      bento3_t: "24/7 Support",
      bento3_d: "One-tap grievance support.",
      cta_h: "READY TO DEPLOY?",
      cta_btn1: "I NEED WORK",
      cta_btn2: "I NEED TALENT"
    },
    ta: {
      portal: "நுழைவு வாயில்",
      h1_1: "உலகளாவிய",
      h1_2: "நெறிமுறை",
      h1_3: "உழைப்பிற்காக.",
      hero_desc: "HireNest என்பது தொழிலாளர் இடமாற்றத்தை இயக்கும் ஒரு இயந்திரம். AI-சரிபார்க்கப்பட்டது. பாதுகாப்பானது. வெளிப்படையானது.",
      btn_w: "வேலை தேடு",
      btn_e: "பணியாளர்களை அமர்த்து",
      stats_p: "கொடுப்பனவுகள்",
      stats_w: "தொழிலாளர்கள்",
      ticker: " // சிஸ்டம் நிலை: சிறப்பானது // சிங்கப்பூரில் புதிய வேலை // சரிபார்க்கப்பட்டது // ",
      prot_h: "நடைமுறை",
      step1_t: "அடையாள சரிபார்ப்பு",
      step1_d: "பயோமெட்ரிக் மற்றும் சட்ட சரிபார்ப்பு.",
      step2_t: "AI பொருத்தம்",
      step2_d: "உங்கள் திறமையை சரியான வேலையுடன் இணைக்கிறது.",
      step3_t: "பணி நியமனம்",
      step3_d: "ஸ்மார்ட் ஒப்பந்தங்கள் உங்கள் சம்பளத்தை உறுதி செய்கின்றன.",
      feat_h: "முக்கிய அம்சங்கள்",
      bento1_t: "AI நியூரல் கோர்",
      bento1_d: "வினாடிக்கு 1.2M பொருத்தங்கள்.",
      bento2_t: "நேரடி வருவாய்",
      bento2_d: "வருமானத்தை நிகழ்நேரத்தில் கண்காணிக்கவும்.",
      bento3_t: "24/7 ஆதரவு",
      bento3_d: "ஒரே தட்டலில் குறை தீர்க்கும் உதவி.",
      cta_h: "தொடங்க தயாரா?",
      cta_btn1: "வேலை வேண்டும்",
      cta_btn2: "தொழிலாளர்கள் வேண்டும்"
    }
  };

  const t = content[lang];

  return (
    <div className="super-app">
      {/* BACKGROUND FX */}
      <div className="noise-canvas"></div>
      <motion.div className="top-progress" style={{ scaleX }} />

      {/* LANGUAGE TOGGLE */}
      <div className="language-switcher">
        <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="lang-toggle-btn">
          <Languages size={16} />
          <span>{lang === 'en' ? 'TAMIL' : 'ENGLISH'}</span>
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="mega-nav">
        <div className="nav-inner">
          <div className="brand">HireNest<span className="accent-dot">.</span></div>
          <div className="system-data">
            <span className="pulse"></span> 
            CORE_V2.0 // {time} // {lang.toUpperCase()}
          </div>
          <Link to="/login" className="portal-btn">{t.portal}</Link>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div 
          key={lang}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.4 }}
        >
          {/* HERO SECTION */}
          <section className="hero-monolith">
            <div className="grid-overlay"></div>
            <div className="container">
              <div className="hero-text-wrap">
                <h1 className="giant-title">
                  {t.h1_1} <br />
                  <span className="outline-txt">{t.h1_2}</span> <br />
                  <span className="orange-txt">{t.h1_3}</span>
                </h1>
                
                <div className="hero-footer">
                  <div className="hero-left">
                    <p className="hero-p">{t.hero_desc}</p>
                    <div className="hero-actions">
                      <Link to="/register/worker" className="action-btn orange-fill">{t.btn_w} <ArrowUpRight size={20}/></Link>
                      <Link to="/register/employer" className="action-btn navy-line">{t.btn_e}</Link>
                    </div>
                  </div>
                  <div className="hero-stats">
                    <div className="stat-box"><h3>$12.8M</h3><p>{t.stats_p}</p></div>
                    <div className="stat-box"><h3>48.2K</h3><p>{t.stats_w}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DATA TICKER */}
          <div className="data-ticker">
            <div className="ticker-scroll">
              {[...Array(10)].map((_, i) => (
                <span key={i}>{t.ticker}</span>
              ))}
            </div>
          </div>

          {/* PROCESS SECTION */}
          <section className="protocol-grid">
            <div className="container">
              <h2 className="section-label">{t.prot_h}</h2>
              <div className="step-row">
                <div className="step-item">
                  <div className="step-head">01 <Fingerprint className="step-icon" /></div>
                  <h3>{t.step1_t}</h3>
                  <p>{t.step1_d}</p>
                </div>
                <div className="step-item active">
                  <div className="step-head">02 <Layers className="step-icon" /></div>
                  <h3>{t.step2_t}</h3>
                  <p>{t.step2_d}</p>
                </div>
                <div className="step-item">
                  <div className="step-head">03 <Globe className="step-icon" /></div>
                  <h3>{t.step3_t}</h3>
                  <p>{t.step3_d}</p>
                </div>
              </div>
            </div>
          </section>

          {/* REAL-TIME UI IMAGE SECTION */}
          <section className="visual-showcase">
            <div className="container">
              <div className="showcase-box">
                <div className="showcase-img">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070" alt="UI" />
                  <div className="img-overlay-ui">
                    <div className="ui-tag"><Activity size={14}/> LIVE_FEED</div>
                    <div className="ui-tag"><Clock size={14}/> UPTIME: 99.9%</div>
                  </div>
                </div>
                <div className="showcase-text">
                  <h2 className="bebas">REAL-TIME<br/><span className="orange-txt">MONITORING.</span></h2>
                  <p>Our interface provides sub-second updates on worker safety, location, and payment status, visible to both parties instantly.</p>
                </div>
              </div>
            </div>
          </section>

          {/* BENTO FEATURES */}
          <section className="bento-section">
            <div className="container">
              <h2 className="section-label">{t.feat_h}</h2>
              <div className="bento-layout">
                <div className="bento-card navy-card tall">
                  <Cpu size={50} className="orange-txt" />
                  <h3>{t.bento1_t}</h3>
                  <p>{t.bento1_d}</p>
                  <div className="card-bg-icon">CPU</div>
                </div>
                <div className="bento-card wide">
                  <div className="flex-row">
                    <BarChart3 size={40} />
                    <div>
                      <h3>{t.bento2_t}</h3>
                      <p>{t.bento2_d}</p>
                    </div>
                  </div>
                </div>
                <div className="bento-card orange-card">
                  <MessageSquare size={40} color="white" />
                  <h3 className="white-txt">{t.bento3_t}</h3>
                  <p className="white-txt">{t.bento3_d}</p>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="final-cta">
            <div className="container">
              <div className="cta-monolith">
                <h2 className="bebas">{t.cta_h}</h2>
                <div className="cta-btns">
                  <Link to="/register/worker" className="btn-huge">{t.cta_btn1}</Link>
                  <Link to="/register/employer" className="btn-huge navy-btn">{t.cta_btn2}</Link>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      <footer className="footer-dark">
        <div className="container footer-grid">
          <div className="f-left">
            <h2 className="bebas">HireNest<span className="orange-txt">.</span></h2>
            <p>© 2026 GLOBAL INFRASTRUCTURE.</p>
          </div>
          <div className="f-right">
            <Link to="/privacy">PRIVACY</Link>
            <Link to="/terms">TERMS</Link>
            <Link to="/contact">SUPPORT</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
// src/components/common/LanguageToggle.jsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      style={{
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => e.target.style.background = '#2563eb'}
      onMouseOut={(e) => e.target.style.background = '#3b82f6'}
    >
      <span>🌐</span>
      <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle;
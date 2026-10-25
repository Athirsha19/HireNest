import React from 'react';

const Loader = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '200px' 
    }}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
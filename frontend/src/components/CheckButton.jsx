import React from 'react';

const CheckButton = ({ checked, onToggle }) => {
  return (
    <div 
      className={`check-button ${checked ? 'checked' : ''}`}
      onClick={onToggle}
    >
      {checked && <div className="check-mark">&#10003;</div>}
    </div>
  );
};

export default CheckButton;
import React from 'react';

export const Input = ({ 
  label, 
  id, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '16px' }}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        {...props}
      />
    </div>
  );
};

import React from 'react';

export const Select = ({ label, id, value, onChange, options = [], className = '', ...props }) => {
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '16px' }}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="form-input"
        style={{ appearance: 'none' }}
        {...props}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

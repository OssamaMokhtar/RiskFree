import React from 'react';

export const Chip = ({ label, className = '' }) => {
  return (
    <span className={`chip ${className}`} style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 12px',
      fontSize: '12px',
      backgroundColor: 'var(--bg-input)',
      border: '1px solid var(--border-color)',
      borderRadius: '9999px',
      color: 'var(--text-secondary)'
    }}>
      {label}
    </span>
  );
};

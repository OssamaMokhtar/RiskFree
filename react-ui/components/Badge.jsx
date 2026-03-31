import React from 'react';

export const Badge = ({ label, variant = 'info', className = '' }) => {
  // variants: success, warning, danger, info
  return (
    <span className={`badge badge-${variant} ${className}`} style={{
      display: 'inline-block',
      padding: '2px 8px',
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '4px',
      textTransform: 'uppercase'
    }}>
      {label}
    </span>
  );
};

import React from 'react';

export const Button = ({ 
  children, 
  variant = 'primary', 
  disabled = false, 
  onClick, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  // variants: primary, secondary, ghost, danger
  const baseClass = `btn btn-${variant} ${className}`;
  
  return (
    <button 
      type={type}
      className={baseClass} 
      disabled={disabled} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

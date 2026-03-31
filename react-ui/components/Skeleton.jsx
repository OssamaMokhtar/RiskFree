import React from 'react';

export const Skeleton = ({ type = 'text', width, className = '', style = {} }) => {
  let baseClass = 'skeleton ';
  if (type === 'text') baseClass += 'skeleton-text';
  else if (type === 'title') baseClass += 'skeleton-title';
  else if (type === 'avatar') baseClass += 'skeleton-avatar';
  else baseClass += `skeleton-${type}`;

  return (
    <div 
      className={`${baseClass} ${className}`} 
      style={{ width: width || undefined, ...style }}
      aria-busy="true"
      aria-hidden="true"
    />
  );
};

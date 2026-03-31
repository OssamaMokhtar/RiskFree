import React, { useEffect } from 'react';

export const Modal = ({ isOpen, onClose, title, children, actions }) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`modal-overlay active`}
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: 1, zIndex: 1000,
        transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div 
        className="modal"
        onClick={(e) => e.stopPropagation()} // Prevent close on modal click
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '24px',
          width: '90%', maxWidth: '400px',
          transform: 'translateY(0)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {title && <div className="modal-header" style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{title}</div>}
        <div className="modal-body" style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          {children}
        </div>
        {actions && (
          <div className="modal-actions" style={{ display: 'flex', gap: '12px' }}>
            {/* Consumer provides action buttons. RTL logic handles row-reverse. */}
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

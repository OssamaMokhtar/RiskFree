import React, { useEffect, useState } from 'react';

export const Toast = ({ message, type = 'info', onDismiss }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Slight delay to allow CSS mounting transitions
    const t1 = requestAnimationFrame(() => {
      setShow(true);
    });
    return () => cancelAnimationFrame(t1);
  }, []);

  let borderColor = 'var(--primary-500)';
  if (type === 'success') borderColor = 'var(--accent-emerald)';
  if (type === 'warning') borderColor = 'var(--accent-amber)';
  if (type === 'error') borderColor = 'var(--accent-rose)';

  // Determine direction for CSS transformation if we passed the hook down (simplified here to rely on CSS logic)
  return (
    <div 
      className={`toast ${show ? 'show' : ''}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--text-primary)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        // CSS handles RTL border switching
        borderColor: borderColor
      }}
    >
      <span>{message}</span>
      <button 
        onClick={onDismiss}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', marginLeft: 'auto' }}
        aria-label="Dismiss Notification"
      >
        ✕
      </button>
    </div>
  );
};

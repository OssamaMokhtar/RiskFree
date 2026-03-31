import React from 'react';

export const Card = ({ children, title, icon, trend, className = '' }) => {
  if (trend || icon) {
    // Render as a metric card
    return (
      <div className={`card metric-card ${className}`}>
        <div className="metric-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span className="metric-icon" style={{ fontSize: '24px' }}>{icon}</span>
          {trend && (
            <span className={`metric-trend ${trend.type || 'up'}`} style={{ 
              fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '9999px',
              color: trend.type === 'down' ? 'var(--accent-rose)' : 'var(--accent-emerald)',
              backgroundColor: trend.type === 'down' ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)'
            }}>
              {trend.value}
            </span>
          )}
        </div>
        <div className="metric-value" style={{ fontSize: '32px', fontWeight: 700 }}>{title}</div>
        <div className="metric-label" style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{children}</div>
      </div>
    );
  }

  // Standard Card
  return (
    <div className={`card ${className}`} style={{ 
      backgroundColor: 'var(--bg-card)', 
      border: '1px solid var(--border-color)', 
      borderRadius: '12px', 
      padding: '16px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {title && <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>{title}</h3>}
      {children}
    </div>
  );
};

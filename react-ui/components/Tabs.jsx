import React from 'react';

export const Tabs = ({ tabs = [], activeTab, onChange }) => {
  return (
    <div className="tabs" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '16px', gap: '24px' }}>
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id || (!activeTab && idx === 0);
        return (
          <button
            key={tab.id || idx}
            className={`tab ${isActive ? 'active' : ''}`}
            onClick={() => onChange && onChange(tab.id)}
            style={{
              padding: '8px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${isActive ? 'var(--primary-500)' : 'transparent'}`,
              color: isActive ? 'var(--primary-500)' : 'var(--text-tertiary)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 150ms linear'
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

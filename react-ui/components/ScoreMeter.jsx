import React from 'react';

export const ScoreMeter = ({ score = 0, maxValue = 850, label = 'Credit Score', grade }) => {
  const [offset, setOffset] = React.useState(0);
  const radius = 58;
  const circumference = 2 * Math.PI * radius;

  React.useEffect(() => {
    // Initial animation trigger
    const percent = Math.min(Math.max(score / maxValue, 0), 1);
    const dashOffset = circumference - (percent * circumference);
    
    // Set timeout to allow CSS transition to grab the initial 0 state
    const timer = setTimeout(() => {
      setOffset(dashOffset);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, maxValue, circumference]);

  let color = 'var(--accent-rose)'; // Default poor
  if (score >= 750) color = 'var(--accent-emerald)';
  else if (score >= 650) color = 'var(--accent-cyan)';
  else if (score >= 550) color = 'var(--accent-amber)';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
        <svg viewBox="0 0 140 140" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle 
            cx="70" cy="70" r={radius} 
            style={{ fill: 'none', stroke: 'var(--bg-input)', strokeWidth: 12 }} 
          />
          <circle 
            cx="70" cy="70" r={radius} 
            style={{ 
              fill: 'none', strokeWidth: 12, strokeLinecap: 'round', 
              stroke: color,
              strokeDasharray: circumference,
              strokeDashoffset: offset || circumference,
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }} 
          />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1, color }}>{score}</div>
          {grade && <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{grade}</div>}
        </div>
      </div>
      {(label) && <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>{label}</p>}
    </div>
  );
};

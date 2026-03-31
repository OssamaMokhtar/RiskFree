import React, { useMemo } from 'react';

/**
 * GCC AI Credit Platform — SHAP Waterfall Chart
 * Visualizes local interpretability of a credit score.
 */

const FeatureRow = ({ label, value, x, width, y, color, isRTL, onHover }) => {
  const barWidth = Math.abs(width);
  const barX = isRTL ? x - (width > 0 ? barWidth : 0) : x + (width < 0 ? width : 0);

  return (
    <g className="waterfall-feature" onMouseEnter={() => onHover(label, value)}>
      <text
        x={isRTL ? 385 : 15}
        y={y + 14}
        fontSize="11"
        fontWeight="600"
        fill="var(--text-secondary)"
        textAnchor={isRTL ? 'end' : 'start'}
        style={{ fontFamily: 'inherit' }}
      >
        {label}
      </text>
      <rect
        x={barX}
        y={y}
        width={barWidth}
        height="18"
        rx="2"
        fill={color}
        style={{ transition: 'all 0.6s var(--ease-elastic)' }}
      />
      <text
        x={isRTL ? barX - 6 : barX + barWidth + 6}
        y={y + 14}
        fontSize="10"
        fontWeight="bold"
        fill={color}
        textAnchor={isRTL ? 'end' : 'start'}
      >
        {value > 0 ? '+' : ''}{value}
      </text>
    </g>
  );
};

export const WaterfallChart = ({ lang = 'en', baseline = 600, finalScore = 742, factors = [] }) => {
  const isRTL = lang === 'ar';
  const width = 400;
  const height = 240;
  const margin = { top: 40, right: 20, bottom: 40, left: 20 };
  const chartWidth = width - margin.left - margin.right;
  const scale = 1.2; // Pixels per point

  // Calculate coordinates for the chain
  let currentX = isRTL ? 300 : 100;

  const renderedFactors = useMemo(() => {
    let xAccumulator = currentX;
    return factors.map((f, i) => {
      const stepWidth = f.value * scale;
      const factorX = xAccumulator;
      xAccumulator += stepWidth;
      return {
        ...f,
        x: factorX,
        width: stepWidth,
        y: margin.top + (i * 32),
        color: f.value > 0 ? 'var(--accent-success)' : 'var(--accent-risk)'
      };
    });
  }, [factors, currentX, scale, isRTL]);

  const t = {
    en: { title: 'Score Explanation (SHAP)', baseline: 'Baseline', final: 'Final Score', pts: 'pts' },
    ar: { title: 'شرح التقييم (SHAP)', baseline: 'الأساس', final: 'التقييم النهائي', pts: 'نقطة' }
  }[lang];

  return (
    <div className="card-premium" style={{ padding: 24, minWidth: width }}>
      <h3 style={{ fontSize: 14, marginBottom: 20, textAlign: isRTL ? 'right' : 'left' }}>{t.title}</h3>

      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
        {/* Y-Axis Guideline (Baseline) */}
        <line
          x1={currentX} y1={margin.top - 10}
          x2={currentX} y2={height - margin.bottom + 10}
          stroke="var(--border-color)"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <text
          x={currentX} y={margin.top - 20}
          fontSize="10" fontWeight="700" fill="var(--text-tertiary)"
          textAnchor="middle"
        >
          {t.baseline} ({baseline})
        </text>

        {/* Rows */}
        {renderedFactors.map((f, i) => (
          <FeatureRow
            key={i}
            isRTL={isRTL}
            label={f.label[lang] || f.label.en}
            value={f.value}
            x={f.x}
            width={f.width}
            y={f.y}
            color={f.color}
            onHover={() => {}}
          />
        ))}

        {/* Final Score Indicator */}
        <g transform={`translate(0, ${height - margin.bottom + 10})`}>
          <rect
            x={isRTL ? renderedFactors[factors.length - 1]?.x + renderedFactors[factors.length - 1]?.width - 50 : renderedFactors[factors.length - 1]?.x + renderedFactors[factors.length - 1]?.width}
            y="0" width="50" height="20" rx="4"
            fill="var(--primary-500)"
          />
          <text
            x={isRTL ? renderedFactors[factors.length - 1]?.x + renderedFactors[factors.length - 1]?.width - 25 : renderedFactors[factors.length - 1]?.x + renderedFactors[factors.length - 1]?.width + 25}
            y="14" fill="white" fontSize="11" fontWeight="700" textAnchor="middle"
          >
            {finalScore}
          </text>
        </g>
      </svg>

      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
          {isRTL ? 'إجمالي النقاط المكتسبة' : 'Total Points Derived'}: {Math.abs(finalScore - baseline)} {t.pts}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: 10 }}>
          {isRTL ? '✨ اسأل المساعد عن التفاصيل' : '✨ Ask Copilot to Explain'}
        </button>
      </div>
    </div>
  );
};

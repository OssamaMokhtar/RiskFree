import React, { useState, useMemo } from 'react';
import { REGULATORY_RULES } from '../../lib/copilotCore';
import { CopilotUI } from '../Copilot/CopilotUI';
import { WaterfallChart } from '../Charts/WaterfallChart';

// ============================================================
// UAE DEFAULTS (CBUAE)
// ============================================================
const COUNTRY = 'UAE';
const RULES = REGULATORY_RULES[COUNTRY];

const SECTORS = [
  { value: 0.05, label: { en: 'Technology', ar: 'تقنية المعلومات' } },
  { value: 0.10, label: { en: 'Trade & Retail', ar: 'التجارة والتجزئة' } },
  { value: 0.15, label: { en: 'Real Estate', ar: 'العقارات' } },
  { value: 0.20, label: { en: 'Construction', ar: 'البناء والإنشاء' } },
  { value: 0.25, label: { en: 'Oil & Gas', ar: 'النفط والغاز' } },
];

/**
 * Deterministic Scoring Logic for Simulation
 */
const computeScore = ({ salary, loanAmount, tenorMonths, collateral, cashflow, sectorRisk }) => {
  let score = 450; 
  const monthlyPmt = loanAmount / tenorMonths;
  const dsr = monthlyPmt / Math.max(salary, 1);
  
  if (dsr <= 0.20) score += 200;
  else if (dsr <= 0.35) score += 150;
  else if (dsr <= RULES.maxDSR) score += 80;
  else score -= 50;

  const ltvRatio = loanAmount / Math.max(collateral, 1);
  if (ltvRatio <= 0.5) score += 100;
  else if (ltvRatio <= 0.8) score += 60;

  if (cashflow > 0) {
    const coverage = cashflow / Math.max(monthlyPmt, 1);
    if (coverage >= 3) score += 100;
    else if (coverage >= 1.5) score += 60;
  }

  score -= Math.round(sectorRisk * 400);
  return Math.max(300, Math.min(850, Math.round(score)));
};

const getRiskLevel = (score) => {
  if (score >= 700) return { level: 'low', color: 'var(--accent-success)', label: { en: 'Low Risk', ar: 'مخاطر منخفضة' } };
  if (score >= 600) return { level: 'medium', color: 'var(--accent-warning)', label: { en: 'Medium Risk', ar: 'مخاطر متوسطة' } };
  return { level: 'high', color: 'var(--accent-risk)', label: { en: 'High Risk', ar: 'مخاطر عالية' } };
};

const SliderField = ({ label, min, max, step, value, onChange, format }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
      <span className="data-digit" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary-500)' }}>{format ? format(value) : value}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step}
      value={value} onChange={e => onChange(Number(e.target.value))}
      className="premium-slider"
      style={{ width: '100%', accentColor: 'var(--primary-500)', cursor: 'pointer', height: '4px' }}
    />
  </div>
);

const RuleAlert = ({ passes, message }) => (
  <div style={{
    padding: '10px 14px', borderRadius: '10px', fontSize: '12px', display: 'flex', gap: '10px', alignItems: 'center',
    background: passes ? 'rgba(16,185,129,0.05)' : 'rgba(244,63,94,0.05)',
    color: passes ? 'var(--accent-success)' : 'var(--accent-risk)',
    border: `1px solid ${passes ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}`,
    transition: 'all 0.3s ease'
  }}>
    <span style={{ fontSize: '14px' }}>{passes ? '✓' : '✕'}</span>
    <span style={{ fontWeight: 500 }}>{message}</span>
  </div>
);

export const ScenarioSimulator = ({ lang = 'en' }) => {
  const [mode, setMode] = useState('retail');
  const [salary, setSalary] = useState(18000);
  const [loanAmount, setLoanAmount] = useState(120000);
  const [tenorMonths, setTenorMonths] = useState(36);
  const [collateral, setCollateral] = useState(0);
  const [cashflow, setCashflow] = useState(60000);
  const [sectorRisk, setSectorRisk] = useState(0.10);
  const [showCopilot, setShowCopilot] = useState(false);

  const isRetail = mode === 'retail';
  const currentScore = useMemo(() => computeScore({
    salary, loanAmount, tenorMonths, collateral,
    cashflow: isRetail ? 0 : cashflow,
    sectorRisk: isRetail ? 0 : sectorRisk,
  }), [salary, loanAmount, tenorMonths, collateral, cashflow, sectorRisk, isRetail]);

  const baselineScore = 620;
  const risk = getRiskLevel(currentScore);
  const dsr = (loanAmount / tenorMonths) / Math.max(salary, 1);
  const dsrPasses = dsr <= RULES.maxDSR;
  
  const shapFactors = useMemo(() => [
    { label: { en: 'Salary Stability', ar: 'استقرار الدخل' }, value: Math.round((salary - 10000) / 400) },
    { label: { en: 'Loan-to-Value', ar: 'نسبة التمويل' }, value: collateral > 0 ? 35 : -10 },
    { label: { en: 'Payment History', ar: 'سجل السداد' }, value: 75 },
    { label: { en: 'Sector Risk', ar: 'مخاطر القطاع' }, value: isRetail ? -5 : -Math.round(sectorRisk * 150) },
    { label: { en: 'Debt Load', ar: 'عبء الدين' }, value: -Math.round(dsr * 100) },
  ], [salary, collateral, isRetail, sectorRisk, dsr]);

  const t = {
    en: {
      title: 'What-if Scenario Simulator',
      retail: 'Retail Loan', sme: 'SME Lending',
      salary: 'Declared Salary', loanAmt: 'Loan Amount', tenor: 'Tenor (Months)',
      collateral: 'Collateral', cashflow: 'Monthly Cashflow', sector: 'Sector Risk',
      askCopilot: '✨ Explain with AI',
    },
    ar: {
      title: 'محاكاة سيناريو ائتماني',
      retail: 'قرض أفراد', sme: 'تمويل شركات',
      salary: 'الراتب الشهري', loanAmt: 'مبلغ القرض', tenor: 'المدة (شهور)',
      collateral: 'قيمة الضمان', cashflow: 'التدفق النقدي', sector: 'مخاطر القطاع',
      askCopilot: '✨ اشرح عبر الذكاء الاصطناعي',
    }
  }[lang];

  return (
    <div className="dashboard-grid role-officer" style={{ paddingBottom: 60 }}>
      {/* Selection Control */}
      <div className="card-premium" style={{ gridColumn: '1 / -1', padding: '12px', display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {['retail', 'sme'].map(m => (
          <button key={m} onClick={() => setMode(m)} className={`btn ${mode === m ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1 }}>
            {m === 'retail' ? t.retail : t.sme}
          </button>
        ))}
      </div>

      {/* Input Section */}
      <div className="card-premium" style={{ padding: 28 }}>
        <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '24px' }}>{t.title}</h2>
        
        <SliderField label={t.salary} min={5000} max={150000} step={1000} value={salary} onChange={setSalary} format={v => `${v.toLocaleString()} AED`} />
        <SliderField label={t.loanAmt} min={10000} max={2000000} step={10000} value={loanAmount} onChange={setLoanAmount} format={v => `${v.toLocaleString()} AED`} />
        <SliderField label={t.tenor} min={6} max={60} step={6} value={tenorMonths} onChange={setTenorMonths} format={v => `${v} mo`} />
        <SliderField label={t.collateral} min={0} max={3000000} step={50000} value={collateral} onChange={setCollateral} format={v => `${v.toLocaleString()} AED`} />

        {!isRetail && (
          <div className="page-enter">
            <SliderField label={t.cashflow} min={10000} max={500000} step={5000} value={cashflow} onChange={setCashflow} format={v => `${v.toLocaleString()} AED`} />
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>{t.sector}</label>
              <select value={sectorRisk} onChange={e => setSectorRisk(Number(e.target.value))} className="card-premium" style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: 'none', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none' }}>
                {SECTORS.map(s => <option key={s.value} value={s.value}>{s.label[lang]}</option>)}
              </select>
            </div>
          </div>
        )}

        <button className="btn btn-primary pulse-active" onClick={() => setShowCopilot(true)} style={{ width: '100%', padding: '16px', marginTop: '16px' }}>
          {t.askCopilot}
        </button>
      </div>

      {/* Visualization Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <WaterfallChart
          lang={lang}
          baseline={baselineScore}
          finalScore={currentScore}
          factors={shapFactors}
        />

        <div className="card-premium" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
             <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-tertiary)' }}>{lang === 'ar' ? 'فحوصات CBUAE' : 'CBUAE Compliance'}</span>
             <span className="badge" style={{ background: dsrPasses ? 'var(--accent-success)' : 'var(--accent-risk)', color: 'white' }}>
               {dsrPasses ? 'PASSED' : 'FLAGGED'}
             </span>
          </div>
          <RuleAlert passes={dsrPasses} message={`${lang === 'ar' ? 'نسبة عبء الدين' : 'Debt Service Ratio'}: ${(dsr * 100).toFixed(1)}%`} />
          <RuleAlert passes={salary > 5000} message={`${lang === 'ar' ? 'الحد الأدنى للراتب' : 'Minimum Salary Guide'}: Approved`} />
        </div>
      </div>

      {showCopilot && (
        <CopilotUI 
          lang={lang} 
          context={{ country: 'UAE' }} 
          payload={{ score: currentScore, dsr: (dsr * 100).toFixed(1) }} 
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { CopilotUI } from './components/Copilot/CopilotUI';
import { ScenarioSimulator } from './components/Simulator/ScenarioSimulator';
import { PulseEngine } from './lib/pulseEngine';
import './global.css';

// ─── i18n ────────────────────────────────────────────────────────────────────
const i18n = {
  en: {
    brand: 'GCC AI Credit Platform',
    roles: { officer: 'Credit Officer', manager: 'Risk Manager', specialist: 'SME Specialist' },
    nav: { simulator: 'Scenario Simulator', gallery: 'Analytics Dashboard' },
    theme: '🌙 Dark / ☀️ Light',
    toggleLang: 'العربية',
  },
  ar: {
    brand: 'منصة ائتمان الذكاء الاصطناعي',
    roles: { officer: 'مسؤول ائتمان', manager: 'مدير مخاطر', specialist: 'أخصائي شركات' },
    nav: { simulator: 'محاكاة السيناريو', gallery: 'لوحة التحليلات' },
    theme: '🌙 / ☀️',
    toggleLang: 'English',
  },
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('simulator');
  const [userRole, setUserRole] = useState('officer');
  const [activeInsights, setActiveInsights] = useState([]);

  // 1. Proactive Pulse Engine Monitoring
  useEffect(() => {
    const runMonitoring = () => {
      // Simulate real-time monitoring of dashboard data
      const mockDashboardData = { 
        loanAmount: 750000, 
        salary: 11000, 
        tenorMonths: 36, 
        mode: userRole === 'specialist' ? 'sme' : 'retail',
        isNewApplicant: true,
        sectorRisk: 0.18,
        sector: 'Real Estate'
      };
      const insights = PulseEngine.evaluate(mockDashboardData);
      setActiveInsights(insights);
    };

    runMonitoring();
    const probe = setInterval(runMonitoring, 12000); // Check every 12s
    return () => clearInterval(probe);
  }, [userRole]);

  // 2. Global Attributes Handling
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = i18n[lang];

  return (
    <div className={`app-shell role-${userRole}`}>
      {/* Premium Mirroring Topbar */}
      <header className="app-topbar card-premium" style={{ margin: '16px 24px', borderRadius: '16px', position: 'relative' }}>
        <div className="app-topbar-logo">
          <div className="app-topbar-logo-icon" style={{ fontSize: 24 }}>🏦</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 900, fontSize: '16px', color: 'var(--text-primary)' }}>{t.brand}</span>
            <span style={{ fontSize: '10px', color: 'var(--primary-500)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t.roles[userRole]}
            </span>
          </div>
        </div>

        <nav className="app-nav">
          {Object.entries(t.nav).map(([key, label]) => (
            <button key={key} className={`app-nav-btn ${page === key ? 'active' : ''}`} onClick={() => setPage(key)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="app-topbar-actions" style={{ gap: 12 }}>
          {/* Role Switcher (Persona Change) */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              style={{ padding: '6px 12px', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', outline: 'none' }}
            >
              {Object.keys(t.roles).map(r => <option key={r} value={r}>{t.roles[r]}</option>)}
            </select>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')} style={{ minWidth: 80 }}>
            {t.toggleLang}
          </button>
          
          <button className="btn btn-secondary btn-sm" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{ width: 40 }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content Area with Adaptive Grid */}
      <main className="app-main" style={{ padding: '0 24px' }}>
        {page === 'simulator' && (
          <div className="page-enter">
            <ScenarioSimulator lang={lang} />
          </div>
        )}

        {page === 'gallery' && (
          <div className="page-enter">
            <div className={`dashboard-grid role-${userRole}`}>
              {/* Contextual Widgets based on Role */}
              <div className="card-premium" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
                 {userRole === 'manager' ? 'Portfolio Risk Heatmap' : 'Application Queue'}
              </div>
              <div className="card-premium" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
                 {userRole === 'manager' ? 'NPL Trends' : 'Decision Bottlenecks'}
              </div>
              {userRole === 'manager' && (
                <div className="card-premium" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)' }}>
                   Sector Concentration
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Persistent Proactive Copilot */}
      <CopilotUI 
        lang={lang} 
        isPulsing={activeInsights.length > 0} 
        insights={activeInsights}
      />
    </div>
  );
}

/* ============================================================
   PAGE RENDERERS — Dashboard, Applications, Scoring, etc.
   ============================================================ */

// ── Dashboard ──
function renderDashboard(container) {
    const cc = countryConfig[state.country];
    container.innerHTML = `
    <div class="page-header">
        <h1 class="page-title" data-en="Dashboard Overview" data-ar="نظرة عامة على لوحة المعلومات">${state.language === 'ar' ? 'نظرة عامة على لوحة المعلومات' : 'Dashboard Overview'}</h1>
        <p class="page-subtitle" data-en="Real-time credit scoring & risk analytics" data-ar="تقييم ائتماني وتحليل مخاطر في الوقت الفعلي">${state.language === 'ar' ? 'تقييم ائتماني وتحليل مخاطر في الوقت الفعلي' : 'Real-time credit scoring & risk analytics'} — ${cc.name} (${cc.regulator})</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card" style="--card-accent: var(--primary-500); --icon-bg: rgba(99,102,241,0.15)">
            <div class="stat-card-header">
                <div class="stat-icon">📊</div>
                <div class="stat-trend up">↑ 12%</div>
            </div>
            <div class="stat-value">2,847</div>
            <div class="stat-label">${state.language === 'ar' ? 'إجمالي الطلبات' : 'Total Applications'}</div>
        </div>
        <div class="stat-card" style="--card-accent: var(--accent-emerald); --icon-bg: rgba(16,185,129,0.15)">
            <div class="stat-card-header">
                <div class="stat-icon">✅</div>
                <div class="stat-trend up">↑ 3.2%</div>
            </div>
            <div class="stat-value">68.4%</div>
            <div class="stat-label">${state.language === 'ar' ? 'معدل الموافقة' : 'Approval Rate'}</div>
        </div>
        <div class="stat-card" style="--card-accent: var(--accent-cyan); --icon-bg: rgba(6,182,212,0.15)">
            <div class="stat-card-header">
                <div class="stat-icon">🎯</div>
                <div class="stat-trend up">↑ 0.8</div>
            </div>
            <div class="stat-value">0.847</div>
            <div class="stat-label">${state.language === 'ar' ? 'نموذج AUC-ROC' : 'Model AUC-ROC'}</div>
        </div>
        <div class="stat-card" style="--card-accent: var(--accent-amber); --icon-bg: rgba(245,158,11,0.15)">
            <div class="stat-card-header">
                <div class="stat-icon">⚠️</div>
                <div class="stat-trend down">↑ 0.3%</div>
            </div>
            <div class="stat-value">2.1%</div>
            <div class="stat-label">${state.language === 'ar' ? 'نسبة القروض المتعثرة' : 'NPL Ratio'}</div>
        </div>
        <div class="stat-card" style="--card-accent: var(--accent-rose); --icon-bg: rgba(244,63,94,0.15)">
            <div class="stat-card-header">
                <div class="stat-icon">🚨</div>
                <div class="stat-trend down">↑ 2</div>
            </div>
            <div class="stat-value">15</div>
            <div class="stat-label">${state.language === 'ar' ? 'تنبيهات الاحتيال النشطة' : 'Active Fraud Alerts'}</div>
        </div>
        <div class="stat-card" style="--card-accent: var(--accent-violet); --icon-bg: rgba(139,92,246,0.15)">
            <div class="stat-card-header">
                <div class="stat-icon">🤖</div>
                <div class="stat-trend up">↑ 24%</div>
            </div>
            <div class="stat-value">342</div>
            <div class="stat-label">${state.language === 'ar' ? 'استعلامات المساعد الذكي' : 'AI Copilot Queries'}</div>
        </div>
    </div>

    <div class="grid-2-1">
        <div class="card">
            <div class="card-header">
                <span class="card-title">📈 ${state.language === 'ar' ? 'توزيع الدرجات الائتمانية' : 'Credit Score Distribution'}</span>
                <div class="country-tabs">
                    ${Object.entries(countryConfig).map(([code, c]) => 
                        `<button class="country-tab ${code === state.country ? 'active' : ''}" onclick="changeCountry('${code}')">${c.name}</button>`
                    ).join('')}
                </div>
            </div>
            <div class="card-body">
                <div class="bar-chart" style="margin-bottom: 40px;">
                    <div class="bar" style="height: 15%; background: linear-gradient(to top, #10b981, #34d399)" data-label="AAA" data-value="4%"></div>
                    <div class="bar" style="height: 25%; background: linear-gradient(to top, #10b981, #34d399)" data-label="AA" data-value="8%"></div>
                    <div class="bar" style="height: 45%; background: linear-gradient(to top, #06b6d4, #22d3ee)" data-label="A" data-value="15%"></div>
                    <div class="bar" style="height: 75%; background: linear-gradient(to top, #06b6d4, #22d3ee)" data-label="BBB" data-value="22%"></div>
                    <div class="bar" style="height: 100%; background: linear-gradient(to top, #6366f1, #818cf8)" data-label="BB" data-value="28%"></div>
                    <div class="bar" style="height: 60%; background: linear-gradient(to top, #f59e0b, #fbbf24)" data-label="B" data-value="12%"></div>
                    <div class="bar" style="height: 30%; background: linear-gradient(to top, #f43f5e, #fb7185)" data-label="CCC" data-value="6%"></div>
                    <div class="bar" style="height: 15%; background: linear-gradient(to top, #f43f5e, #fb7185)" data-label="CC" data-value="3%"></div>
                    <div class="bar" style="height: 8%; background: linear-gradient(to top, #dc2626, #ef4444)" data-label="C/D" data-value="2%"></div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <span class="card-title">🏦 ${state.language === 'ar' ? 'صحة المحفظة' : 'Portfolio Health'}</span>
            </div>
            <div class="card-body">
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'إجمالي التعرض' : 'Total Exposure'}</span><span class="health-value" style="color:var(--primary-400)">2.4B ${cc.currency}</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'المتوسط المرجح لاحتمال التعثر' : 'Weighted Avg PD'}</span><span class="health-value" style="color:var(--accent-amber)">3.2%</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'نسبة القروض المتعثرة' : 'NPL Ratio'}</span><span class="health-value" style="color:var(--accent-rose)">2.1%</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'معدل الموافقة' : 'Approval Rate'}</span><span class="health-value" style="color:var(--accent-emerald)">68.4%</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'المعدل التلقائي' : 'Auto-Decision Rate'}</span><span class="health-value" style="color:var(--accent-cyan)">45.2%</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'نسبة الخدمة الدنيا المرجحة' : 'Max DSR (${cc.regulator})'}</span><span class="health-value" style="color:var(--accent-violet)">${(cc.maxDSR*100)}%</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'دقة نموذج جيني' : 'Model Gini'}</span><span class="health-value" style="color:var(--accent-emerald)">0.694</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'انحراف PSI' : 'PSI Drift'}</span><span class="health-value" style="color:var(--accent-emerald)">0.08 ✓</span></div>
            </div>
        </div>
    </div>

    <div class="grid-2">
        <div class="card">
            <div class="card-header">
                <span class="card-title">📋 ${state.language === 'ar' ? 'آخر الطلبات' : 'Recent Applications'}</span>
                <button class="btn btn-ghost" onclick="navigate('applications')">${state.language === 'ar' ? 'عرض الكل' : 'View All'}</button>
            </div>
            <div class="card-body" style="padding:0">
                ${mockApplications.slice(0, 4).map(app => renderAppRow(app)).join('')}
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <span class="card-title">🚨 ${state.language === 'ar' ? 'تنبيهات حرجة' : 'Critical Alerts'}</span>
                <button class="btn btn-ghost" onclick="navigate('fraud')">${state.language === 'ar' ? 'عرض الكل' : 'View All'}</button>
            </div>
            <div class="card-body">
                <div class="alert-timeline">
                    ${mockFraudAlerts.slice(0, 3).map(alert => `
                        <div class="timeline-item">
                            <div class="timeline-dot ${alert.severity.toLowerCase()}"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">${getSeverityBadge(alert.severity)} ${alert.id} — ${alert.type}</div>
                                <div class="timeline-desc">${alert.details}</div>
                                <div class="timeline-time">${alert.time}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

function renderAppRow(app) {
    const name = state.language === 'ar' ? app.nameAr : app.name;
    return `<div class="app-row" onclick="navigate('scoring')">
        <div class="app-row-main">
            <div class="app-customer-avatar">${app.initials}</div>
            <div class="app-details">
                <div class="app-name">${name}</div>
                <div class="app-meta"><span>${app.id}</span><span>${app.product}</span><span>${app.type}</span></div>
            </div>
        </div>
        <div class="app-score-col">
            <div class="app-score-value ${getScoreClass(app.score)}">${app.score}</div>
            <div class="app-score-grade">${app.grade}</div>
        </div>
        <div class="app-amount-col">
            <div class="app-amount">${fmt(app.amount)} ${app.currency}</div>
            <div class="app-product">${getStatusBadge(app.status)}</div>
        </div>
    </div>`;
}

// ── Applications Page ──
function renderApplications(container) {
    container.innerHTML = `
    <div class="page-header">
        <h1 class="page-title">${state.language === 'ar' ? 'طلبات الائتمان' : 'Credit Applications'}</h1>
        <p class="page-subtitle">${state.language === 'ar' ? 'إدارة ومراجعة جميع طلبات الائتمان' : 'Manage and review all credit applications'}</p>
    </div>
    <div class="tabs">
        <button class="tab active">${state.language === 'ar' ? 'الكل' : 'All'} (${mockApplications.length})</button>
        <button class="tab">${state.language === 'ar' ? 'بانتظار المراجعة' : 'Pending'} (3)</button>
        <button class="tab">${state.language === 'ar' ? 'موافق عليها' : 'Approved'} (2)</button>
        <button class="tab">${state.language === 'ar' ? 'مرفوضة' : 'Declined'} (1)</button>
    </div>
    <div class="card">
        <div class="card-body" style="padding:0">
            ${mockApplications.map(app => renderAppRow(app)).join('')}
        </div>
    </div>`;
}

// ── Credit Scoring Page ──
function renderScoring(container) {
    const app = mockApplications[0]; // Ahmed's application
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (app.score / 850) * circumference;
    container.innerHTML = `
    <div class="page-header">
        <h1 class="page-title">${state.language === 'ar' ? 'تقييم ائتماني — ' + app.nameAr : 'Credit Score — ' + app.name}</h1>
        <p class="page-subtitle">${state.language === 'ar' ? 'طلب رقم: ' : 'Application #'}${app.id} | ${app.product} | ${fmt(app.amount)} ${app.currency}</p>
    </div>
    <div class="warning-banner">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">${state.language === 'ar' ? 'تجاوزت نسبة خدمة الدين الحد الأقصى المسموح — يتطلب مراجعة يدوية' : 'DSR exceeds regulatory limit — manual review required'}</span>
    </div>
    <div class="grid-3">
        <div class="card" style="text-align:center">
            <div class="card-body">
                <div class="score-meter">
                    <svg class="score-meter-circle" width="180" height="180" viewBox="0 0 180 180">
                        <circle class="score-meter-bg" cx="90" cy="90" r="70"/>
                        <circle class="score-meter-fill" cx="90" cy="90" r="70" stroke="${getScoreColor(app.score)}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"/>
                    </svg>
                    <div class="score-meter-value">
                        <div class="score-number" style="color:${getScoreColor(app.score)}">${app.score}</div>
                        <div class="score-grade">${app.grade}</div>
                        <div class="score-label">${state.language === 'ar' ? 'الدرجة الائتمانية' : 'Credit Score'}</div>
                    </div>
                </div>
                <div style="margin-top:16px;display:flex;justify-content:center;gap:16px">
                    <div><div style="font-size:0.7rem;color:var(--text-tertiary)">PD</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent-amber)">4.8%</div></div>
                    <div><div style="font-size:0.7rem;color:var(--text-tertiary)">LGD</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent-cyan)">42%</div></div>
                    <div><div style="font-size:0.7rem;color:var(--text-tertiary)">DSR</div><div style="font-size:1.1rem;font-weight:700;color:var(--accent-rose)">52%</div></div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><span class="card-title">🔍 ${state.language === 'ar' ? 'العوامل الإيجابية' : 'Positive Factors'}</span></div>
            <div class="card-body">
                <div class="factor-item"><div class="factor-indicator positive"></div><span class="factor-name">${state.language === 'ar' ? 'جهة عمل حكومية (مستقرة)' : 'Government employer (stable)'}</span><span class="factor-impact positive">+30</span></div>
                <div class="factor-item"><div class="factor-indicator positive"></div><span class="factor-name">${state.language === 'ar' ? 'نسبة سحب نقدي منخفضة' : 'Low cash withdrawal ratio'}</span><span class="factor-impact positive">+15</span></div>
                <div class="factor-item"><div class="factor-indicator positive"></div><span class="factor-name">${state.language === 'ar' ? 'علاقة مصرفية لمدة 3 سنوات' : '3-year banking relationship'}</span><span class="factor-impact positive">+12</span></div>
                <div class="factor-item"><div class="factor-indicator positive"></div><span class="factor-name">${state.language === 'ar' ? 'مدفوعات متكررة منتظمة' : 'Regular recurring payments'}</span><span class="factor-impact positive">+8</span></div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><span class="card-title">⚠️ ${state.language === 'ar' ? 'العوامل السلبية' : 'Negative Factors'}</span></div>
            <div class="card-body">
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'استخدام ائتماني مرتفع (78%)' : 'High credit utilization (78%)'}</span><span class="factor-impact negative">-45</span></div>
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'تأخرتان في 12 شهراً' : '2× late payments in 12 months'}</span><span class="factor-impact negative">-38</span></div>
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'مدة عمل قصيرة (8 أشهر)' : 'Short employment tenure (8m)'}</span><span class="factor-impact negative">-22</span></div>
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'تجاوز نسبة خدمة الدين' : 'DSR exceeds limit (52%)'}</span><span class="factor-impact negative">-15</span></div>
            </div>
        </div>
    </div>
    <div class="grid-2">
        <div class="card">
            <div class="card-header"><span class="card-title">📊 ${state.language === 'ar' ? 'تقييم القدرة على السداد' : 'Affordability Assessment'}</span></div>
            <div class="card-body">
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'الراتب الشهري' : 'Monthly Salary'}</span><span class="health-value">15,000 AED</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'الالتزامات الحالية' : 'Existing Obligations'}</span><span class="health-value" style="color:var(--accent-amber)">5,200 AED</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'القسط المقترح' : 'Proposed EMI'}</span><span class="health-value" style="color:var(--accent-cyan)">2,600 AED</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'إجمالي الالتزامات' : 'Total Obligations'}</span><span class="health-value" style="color:var(--accent-rose)">7,800 AED</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'نسبة خدمة الدين' : 'DSR Ratio'}</span><span class="health-value" style="color:var(--accent-rose)">52.0%</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'الحد الأقصى المسموح' : 'Max Allowed (CBUAE)'}</span><span class="health-value">50.0%</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'الحد الأقصى المؤهل' : 'Max Eligible Amount'}</span><span class="health-value" style="color:var(--accent-emerald)">42,500 AED</span></div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><span class="card-title">⚡ ${state.language === 'ar' ? 'اتخاذ القرار' : 'Decision Actions'}</span></div>
            <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
                <button class="btn btn-success" style="width:100%;justify-content:center;padding:12px">✅ ${state.language === 'ar' ? 'موافقة (بتعديل)' : 'Approve (Modified)'}</button>
                <button class="btn btn-danger" style="width:100%;justify-content:center;padding:12px">❌ ${state.language === 'ar' ? 'رفض' : 'Decline'}</button>
                <button class="btn btn-primary" style="width:100%;justify-content:center;padding:12px" onclick="askCopilot('Suggest risk mitigations for application ${app.id}')">🤖 ${state.language === 'ar' ? 'استشارة المساعد الذكي' : 'Ask AI Copilot'}</button>
                <button class="btn btn-ghost" style="width:100%;justify-content:center;padding:12px">📋 ${state.language === 'ar' ? 'إحالة للجنة' : 'Refer to Committee'}</button>
                <div class="ai-disclaimer" style="margin-top:8px">⚠️ ${state.language === 'ar' ? 'جميع القرارات تتطلب مصادقة بشرية' : 'All decisions require human authorization'}</div>
            </div>
        </div>
    </div>`;
}

// ── SME Lending Page ──
function renderSME(container) {
    const sme = mockApplications[5]; // Gulf Trading LLC
    container.innerHTML = `
    <div class="page-header">
        <h1 class="page-title">${state.language === 'ar' ? 'تمويل المؤسسات الصغيرة والمتوسطة' : 'SME Lending Portal'}</h1>
        <p class="page-subtitle">${state.language === 'ar' ? sme.nameAr : sme.name} — ${sme.product} | ${fmt(sme.amount)} ${sme.currency}</p>
    </div>
    <div class="grid-3">
        <div class="card" style="text-align:center">
            <div class="card-header"><span class="card-title">🏢 ${state.language === 'ar' ? 'التقييم الائتماني' : 'SME Credit Score'}</span></div>
            <div class="card-body">
                <div class="score-number ${getScoreClass(sme.score)}" style="font-size:3rem;margin:16px 0">${sme.score}</div>
                <div class="badge badge-info" style="font-size:0.85rem;padding:6px 16px">${sme.grade}</div>
                <div style="margin-top:20px">
                    <div class="health-row"><span class="health-label">PD</span><span class="health-value" style="color:var(--accent-amber)">4.2%</span></div>
                    <div class="health-row"><span class="health-label">DSCR</span><span class="health-value" style="color:var(--accent-emerald)">1.35x</span></div>
                    <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'تغطية الضمانات' : 'Collateral Coverage'}</span><span class="health-value" style="color:var(--accent-cyan)">120%</span></div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><span class="card-title">📊 ${state.language === 'ar' ? 'مكونات التقييم' : 'Score Components'}</span></div>
            <div class="card-body">
                <div style="margin-bottom:16px"><span style="font-size:0.82rem">${state.language === 'ar' ? 'الصحة المالية' : 'Financial Health'}</span><div class="progress-bar"><div class="progress-fill" style="width:72%"></div></div><span style="font-size:0.75rem;color:var(--text-tertiary)">72/100</span></div>
                <div style="margin-bottom:16px"><span style="font-size:0.82rem">${state.language === 'ar' ? 'استقرار التدفقات النقدية' : 'Cashflow Stability'}</span><div class="progress-bar"><div class="progress-fill warning" style="width:65%"></div></div><span style="font-size:0.75rem;color:var(--text-tertiary)">65/100</span></div>
                <div style="margin-bottom:16px"><span style="font-size:0.82rem">${state.language === 'ar' ? 'مخاطر القطاع' : 'Sector Risk'}</span><div class="progress-bar"><div class="progress-fill success" style="width:85%"></div></div><span style="font-size:0.75rem;color:var(--text-tertiary)">85/100</span></div>
                <div style="margin-bottom:16px"><span style="font-size:0.82rem">${state.language === 'ar' ? 'سلوك السداد' : 'Payment Behavior'}</span><div class="progress-bar"><div class="progress-fill" style="width:78%"></div></div><span style="font-size:0.75rem;color:var(--text-tertiary)">78/100</span></div>
                <div><span style="font-size:0.82rem">${state.language === 'ar' ? 'جودة الإدارة' : 'Management Quality'}</span><div class="progress-bar"><div class="progress-fill warning" style="width:68%"></div></div><span style="font-size:0.75rem;color:var(--text-tertiary)">68/100</span></div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><span class="card-title">🏢 ${state.language === 'ar' ? 'ملف الأعمال' : 'Business Profile'}</span></div>
            <div class="card-body">
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'القطاع' : 'Sector'}</span><span class="health-value">Trading & Logistics</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'سنوات العمل' : 'Years in Business'}</span><span class="health-value">7</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'الإيرادات السنوية' : 'Annual Revenue'}</span><span class="health-value">12M AED</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'عدد الموظفين' : 'Employees'}</span><span class="health-value">45</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'النسبة الجارية' : 'Current Ratio'}</span><span class="health-value" style="color:var(--accent-emerald)">1.8x</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'الدين إلى حقوق الملكية' : 'Debt/Equity'}</span><span class="health-value" style="color:var(--accent-amber)">1.2x</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'هامش الربح الصافي' : 'Net Margin'}</span><span class="health-value" style="color:var(--accent-emerald)">8.5%</span></div>
            </div>
        </div>
    </div>`;
}

// ── Risk Analytics Page ──
function renderRisk(container) {
    container.innerHTML = `
    <div class="page-header">
        <h1 class="page-title">${state.language === 'ar' ? 'تحليل المخاطر' : 'Risk Analytics'}</h1>
        <p class="page-subtitle">${state.language === 'ar' ? 'مراقبة صحة المحفظة ومؤشرات الإنذار المبكر' : 'Portfolio health monitoring & early warning indicators'}</p>
    </div>
    <div class="stats-grid">
        <div class="stat-card" style="--card-accent: var(--primary-500)"><div class="stat-card-header"><div class="stat-icon">📦</div></div><div class="stat-value">2.4B</div><div class="stat-label">${state.language === 'ar' ? 'إجمالي التعرض' : 'Total Exposure'} (${countryConfig[state.country].currency})</div></div>
        <div class="stat-card" style="--card-accent: var(--accent-amber)"><div class="stat-card-header"><div class="stat-icon">📉</div><div class="stat-trend down">↑ 0.3%</div></div><div class="stat-value">2.1%</div><div class="stat-label">${state.language === 'ar' ? 'نسبة القروض المتعثرة' : 'NPL Ratio'}</div></div>
        <div class="stat-card" style="--card-accent: var(--accent-emerald)"><div class="stat-card-header"><div class="stat-icon">🎯</div></div><div class="stat-value">3.2%</div><div class="stat-label">${state.language === 'ar' ? 'المتوسط المرجح PD' : 'Weighted Avg PD'}</div></div>
        <div class="stat-card" style="--card-accent: var(--accent-rose)"><div class="stat-card-header"><div class="stat-icon">🔔</div></div><div class="stat-value">23</div><div class="stat-label">${state.language === 'ar' ? 'إنذارات مبكرة' : 'Early Warnings'}</div></div>
    </div>
    <div class="grid-2">
        <div class="card">
            <div class="card-header"><span class="card-title">📊 ${state.language === 'ar' ? 'توزيع احتمال التعثر' : 'PD Distribution by Grade'}</span></div>
            <div class="card-body">
                <div class="bar-chart" style="margin-bottom:40px">
                    <div class="bar" style="height:8%;background:linear-gradient(to top,#10b981,#34d399)" data-label="AAA" data-value="0.3%"></div>
                    <div class="bar" style="height:15%;background:linear-gradient(to top,#10b981,#34d399)" data-label="AA" data-value="0.8%"></div>
                    <div class="bar" style="height:25%;background:linear-gradient(to top,#06b6d4,#22d3ee)" data-label="A" data-value="1.5%"></div>
                    <div class="bar" style="height:40%;background:linear-gradient(to top,#6366f1,#818cf8)" data-label="BBB" data-value="3.0%"></div>
                    <div class="bar" style="height:60%;background:linear-gradient(to top,#f59e0b,#fbbf24)" data-label="BB" data-value="5.5%"></div>
                    <div class="bar" style="height:80%;background:linear-gradient(to top,#f43f5e,#fb7185)" data-label="B" data-value="9.0%"></div>
                    <div class="bar" style="height:100%;background:linear-gradient(to top,#dc2626,#ef4444)" data-label="CCC+" data-value="15%+"></div>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><span class="card-title">⚠️ ${state.language === 'ar' ? 'مؤشرات الإنذار المبكر' : 'Early Warning Signals'}</span></div>
            <div class="card-body">
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'انخفاض الدرجة > 50 نقطة' : 'Score drop > 50 pts (30d)'}</span><span class="factor-impact negative">8</span></div>
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'مدفوعات متأخرة جديدة' : 'New missed payments'}</span><span class="factor-impact negative">5</span></div>
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'ارتفاع الاستخدام > 90%' : 'Utilization spike > 90%'}</span><span class="factor-impact negative">4</span></div>
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'انخفاض الدخل' : 'Income reduction detected'}</span><span class="factor-impact negative">3</span></div>
                <div class="factor-item"><div class="factor-indicator negative"></div><span class="factor-name">${state.language === 'ar' ? 'ضغوط قطاعية' : 'Sector stress (Construction)'}</span><span class="factor-impact negative">3</span></div>
            </div>
        </div>
    </div>`;
}

// ── Fraud & AML Page ──
function renderFraud(container) {
    container.innerHTML = `
    <div class="page-header">
        <h1 class="page-title">${state.language === 'ar' ? 'الاحتيال ومكافحة غسل الأموال' : 'Fraud & AML Monitor'}</h1>
        <p class="page-subtitle">${state.language === 'ar' ? 'مراقبة المعاملات المشبوهة وإدارة الحالات' : 'Suspicious transaction monitoring & case management'}</p>
    </div>
    <div class="stats-grid">
        <div class="stat-card" style="--card-accent: var(--accent-rose)"><div class="stat-card-header"><div class="stat-icon">🚨</div></div><div class="stat-value">15</div><div class="stat-label">${state.language === 'ar' ? 'تنبيهات مفتوحة' : 'Open Alerts'}</div></div>
        <div class="stat-card" style="--card-accent: var(--accent-rose)"><div class="stat-card-header"><div class="stat-icon">🔴</div></div><div class="stat-value">3</div><div class="stat-label">${state.language === 'ar' ? 'حرجة' : 'Critical'}</div></div>
        <div class="stat-card" style="--card-accent: var(--accent-amber)"><div class="stat-card-header"><div class="stat-icon">📂</div></div><div class="stat-value">7</div><div class="stat-label">${state.language === 'ar' ? 'حالات AML مفتوحة' : 'Open AML Cases'}</div></div>
        <div class="stat-card" style="--card-accent: var(--accent-emerald)"><div class="stat-card-header"><div class="stat-icon">⏱️</div></div><div class="stat-value">2.4d</div><div class="stat-label">${state.language === 'ar' ? 'متوسط وقت الحل' : 'Avg Resolution Time'}</div></div>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">🚨 ${state.language === 'ar' ? 'التنبيهات النشطة' : 'Active Alerts'}</span></div>
        <div class="card-body" style="padding:0;overflow-x:auto">
            <table class="data-table">
                <thead><tr>
                    <th>ID</th><th>${state.language === 'ar' ? 'العميل' : 'Customer'}</th>
                    <th>${state.language === 'ar' ? 'النوع' : 'Type'}</th>
                    <th>${state.language === 'ar' ? 'الخطورة' : 'Severity'}</th>
                    <th>${state.language === 'ar' ? 'التفاصيل' : 'Details'}</th>
                    <th>${state.language === 'ar' ? 'الحالة' : 'Status'}</th>
                    <th>${state.language === 'ar' ? 'الوقت' : 'Time'}</th>
                </tr></thead>
                <tbody>
                    ${mockFraudAlerts.map(a => `<tr>
                        <td style="font-family:var(--font-mono);font-weight:600;font-size:0.8rem">${a.id}</td>
                        <td>${a.customer}</td>
                        <td><span class="badge badge-primary">${a.type}</span></td>
                        <td>${getSeverityBadge(a.severity)}</td>
                        <td style="max-width:300px;font-size:0.82rem">${a.details}</td>
                        <td>${getStatusBadge(a.status)}</td>
                        <td style="font-size:0.78rem;color:var(--text-tertiary)">${a.time}</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>
    </div>`;
}

// ── AI Copilot Page ──
function renderCopilotPage(container) {
    container.innerHTML = `
    <div class="page-header">
        <h1 class="page-title">${state.language === 'ar' ? 'المساعد الذكي للائتمان' : 'AI Credit Copilot'}</h1>
        <p class="page-subtitle">${state.language === 'ar' ? 'استشر المساعد الذكي حول التقييمات والأنظمة' : 'Consult the AI copilot about scores, regulations, and risk mitigations'}</p>
    </div>
    <div class="card" style="text-align:center;padding:48px">
        <div style="font-size:4rem;margin-bottom:16px">🤖</div>
        <h2 style="margin-bottom:8px">${state.language === 'ar' ? 'مرحباً بك في المساعد الذكي' : 'Welcome to AI Credit Copilot'}</h2>
        <p style="color:var(--text-tertiary);margin-bottom:24px;max-width:500px;margin-left:auto;margin-right:auto">${state.language === 'ar' ? 'اضغط على الزر أدناه لفتح لوحة المساعد الذكي والحصول على تحليلات فورية' : 'Click the button below to open the copilot panel and get instant analysis'}</p>
        <button class="btn btn-primary" onclick="toggleCopilotPanel()" style="padding:12px 32px;font-size:1rem">🤖 ${state.language === 'ar' ? 'فتح المساعد الذكي' : 'Open AI Copilot'}</button>
    </div>`;
}

// ── Regulations RAG Page ──
function renderRegulations(container) {
    container.innerHTML = `
    <div class="page-header">
        <h1 class="page-title">${state.language === 'ar' ? 'الأنظمة والتعليمات — استعلام ذكي' : 'Regulations RAG — Intelligent Query'}</h1>
        <p class="page-subtitle">${state.language === 'ar' ? 'استعلم عن أنظمة البنوك المركزية في دول مجلس التعاون' : 'Query GCC central bank regulations using AI-powered retrieval'}</p>
    </div>
    <div class="country-tabs">
        ${Object.entries(countryConfig).map(([code, c]) => 
            `<button class="country-tab ${code === state.country ? 'active' : ''}" onclick="changeCountry('${code}')">🏛️ ${c.regulator} (${c.name})</button>`
        ).join('')}
    </div>
    <div class="card" style="margin-bottom:24px">
        <div class="card-body" style="display:flex;gap:12px">
            <input type="text" style="flex:1;background:var(--bg-input);border:1px solid var(--border-primary);color:var(--text-primary);padding:12px 16px;border-radius:var(--border-radius-md);font-family:var(--font-primary);font-size:0.9rem;outline:none" placeholder="${state.language === 'ar' ? 'اسأل عن الأنظمة...' : 'Ask about regulations...'}" id="ragInput">
            <button class="btn btn-primary" style="padding:12px 24px" onclick="handleRagQuery()">🔍 ${state.language === 'ar' ? 'بحث' : 'Search'}</button>
        </div>
    </div>
    <div id="ragResults" class="grid-2">
        <div class="card">
            <div class="card-header"><span class="card-title">📜 ${state.language === 'ar' ? 'أنظمة محملة' : 'Indexed Regulations'}</span></div>
            <div class="card-body">
                <div class="health-row"><span class="health-label">CBUAE Consumer Protection</span><span class="health-value" style="color:var(--accent-emerald)">✓ Indexed</span></div>
                <div class="health-row"><span class="health-label">SAMA Responsible Lending</span><span class="health-value" style="color:var(--accent-emerald)">✓ Indexed</span></div>
                <div class="health-row"><span class="health-label">QCB Credit Guidelines</span><span class="health-value" style="color:var(--accent-emerald)">✓ Indexed</span></div>
                <div class="health-row"><span class="health-label">CBB Prudential Rules</span><span class="health-value" style="color:var(--accent-emerald)">✓ Indexed</span></div>
                <div class="health-row"><span class="health-label">CBK Consumer Finance</span><span class="health-value" style="color:var(--accent-amber)">⟳ Updating</span></div>
                <div class="health-row"><span class="health-label">CBO Lending Standards</span><span class="health-value" style="color:var(--accent-emerald)">✓ Indexed</span></div>
            </div>
        </div>
        <div class="card">
            <div class="card-header"><span class="card-title">📊 ${state.language === 'ar' ? 'إحصائيات RAG' : 'RAG Statistics'}</span></div>
            <div class="card-body">
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'المستندات المفهرسة' : 'Documents Indexed'}</span><span class="health-value">847</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'إجمالي الأجزاء' : 'Total Chunks'}</span><span class="health-value">12,450</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'نموذج التضمين' : 'Embedding Model'}</span><span class="health-value" style="font-size:0.72rem">text-embedding-3-large</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'قاعدة المتجهات' : 'Vector DB'}</span><span class="health-value">Pinecone</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'آخر تحديث' : 'Last Updated'}</span><span class="health-value">2 hours ago</span></div>
                <div class="health-row"><span class="health-label">${state.language === 'ar' ? 'الاستعلامات اليوم' : 'Queries Today'}</span><span class="health-value" style="color:var(--primary-400)">142</span></div>
            </div>
        </div>
    </div>`;
}

function handleRagQuery() {
    const input = document.getElementById('ragInput');
    if (input.value.trim()) {
        askCopilot(input.value.trim());
        input.value = '';
    }
}

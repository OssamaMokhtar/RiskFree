/* ============================================================
   GCC AI CREDIT PLATFORM — Application Logic
   ============================================================ */

// ── State ──
const state = {
    currentPage: 'dashboard',
    language: 'en',
    theme: 'dark',
    country: 'AE',
    copilotOpen: false,
    sidebarOpen: false
};

// ── Country Configurations ──
const countryConfig = {
    AE: { name: 'UAE', nameAr: 'الإمارات', currency: 'AED', maxDSR: 0.50, minSalary: 5000, regulator: 'CBUAE', bureau: 'AECB' },
    SA: { name: 'KSA', nameAr: 'السعودية', currency: 'SAR', maxDSR: 0.55, minSalary: 4000, regulator: 'SAMA', bureau: 'SIMAH' },
    QA: { name: 'Qatar', nameAr: 'قطر', currency: 'QAR', maxDSR: 0.50, minSalary: 4000, regulator: 'QCB', bureau: 'QCB' },
    BH: { name: 'Bahrain', nameAr: 'البحرين', currency: 'BHD', maxDSR: 0.50, minSalary: 400, regulator: 'CBB', bureau: 'BENEFIT' },
    KW: { name: 'Kuwait', nameAr: 'الكويت', currency: 'KWD', maxDSR: 0.40, minSalary: 400, regulator: 'CBK', bureau: 'Ci-Net' },
    OM: { name: 'Oman', nameAr: 'عمان', currency: 'OMR', maxDSR: 0.50, minSalary: 350, regulator: 'CBO', bureau: 'CBO' }
};

// ── Mock Data ──
const mockApplications = [
    { id: 'AE-2026-1234', name: 'Ahmed Al-Mansouri', nameAr: 'أحمد المنصوري', type: 'RETAIL', product: 'Personal Loan', amount: 50000, currency: 'AED', score: 580, grade: 'BB-', status: 'REFER', dsr: 0.52, initials: 'AM', country: 'AE' },
    { id: 'AE-2026-1235', name: 'Fatima Al-Khalifa', nameAr: 'فاطمة الخليفة', type: 'RETAIL', product: 'Credit Card', amount: 25000, currency: 'AED', score: 742, grade: 'B+', status: 'APPROVED', dsr: 0.38, initials: 'FK', country: 'AE' },
    { id: 'AE-2026-1236', name: 'Mohammed Al-Rashid', nameAr: 'محمد الراشد', type: 'RETAIL', product: 'Auto Loan', amount: 120000, currency: 'AED', score: 695, grade: 'BBB', status: 'SCORED', dsr: 0.44, initials: 'MR', country: 'AE' },
    { id: 'SA-2026-0891', name: 'Khalid Al-Otaibi', nameAr: 'خالد العتيبي', type: 'RETAIL', product: 'Personal Loan', amount: 80000, currency: 'SAR', score: 812, grade: 'AA', status: 'APPROVED', dsr: 0.32, initials: 'KO', country: 'SA' },
    { id: 'AE-2026-1237', name: 'Sara Al-Nuaimi', nameAr: 'سارة النعيمي', type: 'RETAIL', product: 'BNPL', amount: 5000, currency: 'AED', score: 390, grade: 'C', status: 'DECLINED', dsr: 0.61, initials: 'SN', country: 'AE' },
    { id: 'AE-2026-1238', name: 'Gulf Trading LLC', nameAr: 'الخليج للتجارة ش.م.م', type: 'SME', product: 'Working Capital', amount: 500000, currency: 'AED', score: 685, grade: 'BBB', status: 'REFER', dsr: 0.45, initials: 'GT', country: 'AE' },
    { id: 'QA-2026-0456', name: 'Al-Doha Logistics', nameAr: 'الدوحة للخدمات اللوجستية', type: 'SME', product: 'Trade Finance', amount: 1200000, currency: 'QAR', score: 720, grade: 'A-', status: 'SCORED', dsr: 0.35, initials: 'DL', country: 'QA' }
];

const mockFraudAlerts = [
    { id: 'FA-001', customer: 'Unknown Card Holder', type: 'VELOCITY', severity: 'CRITICAL', details: '12 transactions in 5 minutes across 3 countries', time: '2 min ago', status: 'NEW' },
    { id: 'FA-002', customer: 'Ahmed Al-Mahmoud', type: 'SANCTIONS', severity: 'CRITICAL', details: 'Near-match on OFAC sanctions list (92% confidence)', time: '15 min ago', status: 'ASSIGNED' },
    { id: 'FA-003', customer: 'Gulf Trading LLC', type: 'AMOUNT', severity: 'HIGH', details: 'Transfer of 890,000 AED — 5x normal daily volume', time: '1 hour ago', status: 'INVESTIGATING' },
    { id: 'FA-004', customer: 'Fatima K.', type: 'GEOLOCATION', severity: 'MEDIUM', details: 'Transaction from Nigeria — customer has no travel history', time: '3 hours ago', status: 'NEW' },
    { id: 'FA-005', customer: 'ABC Construction', type: 'PATTERN', severity: 'MEDIUM', details: 'Circular fund flow detected between 3 related accounts', time: '5 hours ago', status: 'ASSIGNED' }
];

// ── Initialization ──
document.addEventListener('DOMContentLoaded', () => {
    renderPage('dashboard');
    document.getElementById('copilotInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendCopilotMessage();
    });
});

// ── Navigation ──
function navigate(page) {
    state.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-page="${page}"]`).classList.add('active');
    const pageNames = {
        dashboard: { en: 'Dashboard', ar: 'لوحة المعلومات' },
        applications: { en: 'Applications', ar: 'الطلبات' },
        scoring: { en: 'Credit Scoring', ar: 'تقييم الائتمان' },
        sme: { en: 'SME Lending', ar: 'تمويل المؤسسات' },
        risk: { en: 'Risk Analytics', ar: 'تحليل المخاطر' },
        fraud: { en: 'Fraud & AML', ar: 'الاحتيال وغسل الأموال' },
        copilot: { en: 'AI Copilot', ar: 'المساعد الذكي' },
        regulations: { en: 'Regulations RAG', ar: 'الأنظمة والتعليمات' }
    };
    const bc = document.getElementById('breadcrumbCurrent');
    bc.textContent = pageNames[page][state.language];
    bc.setAttribute('data-en', pageNames[page].en);
    bc.setAttribute('data-ar', pageNames[page].ar);
    renderPage(page);
    if (state.sidebarOpen) toggleSidebar();
    return false;
}

function renderPage(page) {
    const content = document.getElementById('pageContent');
    content.classList.remove('fade-in');
    void content.offsetWidth;
    content.classList.add('fade-in');
    const renderers = { dashboard: renderDashboard, applications: renderApplications, scoring: renderScoring, sme: renderSME, risk: renderRisk, fraud: renderFraud, copilot: renderCopilotPage, regulations: renderRegulations };
    if (renderers[page]) renderers[page](content);
}

// ── Language ──
function setLanguage(lang) {
    state.language = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.getElementById('langToggle').textContent = lang === 'en' ? 'عربي' : 'EN';
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        el.textContent = el.getAttribute(`data-${lang}`);
    });
    document.querySelectorAll(`[data-${lang}-placeholder]`).forEach(el => {
        el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
    });
    document.getElementById('langSwitchOverlay').classList.add('hidden');
    renderPage(state.currentPage);
}

function toggleLanguage() {
    setLanguage(state.language === 'en' ? 'ar' : 'en');
}

// ── Theme ──
function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
}

// ── Sidebar ──
function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    document.getElementById('sidebar').classList.toggle('open', state.sidebarOpen);
}

// ── Country ──
function changeCountry(code) {
    state.country = code;
    renderPage(state.currentPage);
}

// ── Copilot Panel ──
function toggleCopilotPanel() {
    state.copilotOpen = !state.copilotOpen;
    document.getElementById('copilotPanel').classList.toggle('open', state.copilotOpen);
}

function toggleNotifications() {
    // Placeholder for notification panel
}

function sendCopilotMessage() {
    const input = document.getElementById('copilotInput');
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    askCopilot(msg);
}

function askCopilot(question) {
    const messages = document.getElementById('copilotMessages');
    if (!state.copilotOpen) toggleCopilotPanel();
    // Add user message
    messages.innerHTML += `<div class="copilot-message user"><div class="message-avatar">AM</div><div class="message-content"><p>${escapeHtml(question)}</p></div></div>`;
    // Typing indicator
    messages.innerHTML += `<div class="copilot-message bot" id="typing"><div class="message-avatar">🤖</div><div class="message-content"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div></div>`;
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
        document.getElementById('typing')?.remove();
        const response = getCopilotResponse(question);
        messages.innerHTML += `<div class="copilot-message bot"><div class="message-avatar">🤖</div><div class="message-content">${response}<div class="ai-disclaimer">⚠️ ${state.language === 'ar' ? 'توصية ذكاء اصطناعي — القرار النهائي يعود للمسؤول' : 'AI-generated recommendation — final decision rests with the officer'}</div></div></div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 1500);
}

function getCopilotResponse(q) {
    const lower = q.toLowerCase();
    if (lower.includes('580') || lower.includes('score')) {
        return `<p><strong>Score Analysis — Application #AE-2026-1234</strong></p>
        <p>Score: <strong>580</strong> (Grade: BB-)</p>
        <p><strong>Key Negative Factors:</strong></p>
        <ul><li>🔴 High credit utilization (78%) — <strong>-45 pts</strong></li>
        <li>🔴 Two 30+ DPD events in 12 months — <strong>-38 pts</strong></li>
        <li>🔴 Short employment tenure (8 months) — <strong>-22 pts</strong></li></ul>
        <p><strong>Key Positive Factors:</strong></p>
        <ul><li>🟢 Government employer (stable) — <strong>+30 pts</strong></li>
        <li>🟢 Low cash withdrawal ratio — <strong>+15 pts</strong></li></ul>
        <p>DSR at requested amount: <strong>52%</strong> (exceeds CBUAE limit of 50%)</p>`;
    }
    if (lower.includes('dsr') || lower.includes('debt')) {
        const cc = countryConfig[state.country];
        return `<p><strong>DSR Limits — ${cc.name} (${cc.regulator})</strong></p>
        <p>Maximum DSR for retail customers: <strong>${(cc.maxDSR*100)}%</strong></p>
        <p>Minimum salary requirement: <strong>${cc.minSalary.toLocaleString()} ${cc.currency}</strong></p>
        <p>Credit bureau used: <strong>${cc.bureau}</strong></p>
        <p>Note: DSR calculation includes all existing EMIs + 5% of credit card limits + proposed EMI.</p>`;
    }
    if (lower.includes('mitigat')) {
        return `<p><strong>Suggested Risk Mitigations:</strong></p>
        <ul><li>📉 Reduce loan amount by 15% to bring DSR to 48% (within limit)</li>
        <li>📄 Request 6 months salary certificates for verification</li>
        <li>⏱️ Consider shorter tenure (36m vs 48m) to reduce total interest</li>
        <li>🔒 Request salary assignment letter from employer</li>
        <li>👤 Consider adding a guarantor to strengthen the application</li></ul>`;
    }
    return `<p>I've analyzed your query. Based on the available data and GCC regulatory framework, here are my findings:</p>
    <p>The platform currently monitors <strong>${mockApplications.length}</strong> active applications across <strong>${Object.keys(countryConfig).length}</strong> GCC countries.</p>
    <p>How can I help you further? You can ask about specific scores, regulations, or risk mitigations.</p>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ── Helper Functions ──
function getScoreColor(score) {
    if (score >= 750) return 'var(--accent-emerald)';
    if (score >= 650) return '#22d3ee';
    if (score >= 550) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
}

function getScoreClass(score) {
    if (score >= 750) return 'score-excellent';
    if (score >= 650) return 'score-good';
    if (score >= 550) return 'score-fair';
    return 'score-poor';
}

function getStatusBadge(status) {
    const map = { APPROVED: 'badge-success', DECLINED: 'badge-danger', REFER: 'badge-warning', SCORED: 'badge-info', SUBMITTED: 'badge-primary' };
    return `<span class="badge ${map[status] || 'badge-primary'}">${status}</span>`;
}

function getSeverityBadge(sev) {
    const map = { CRITICAL: 'badge-danger', HIGH: 'badge-warning', MEDIUM: 'badge-info', LOW: 'badge-primary' };
    return `<span class="badge ${map[sev] || 'badge-primary'}">${sev}</span>`;
}

function fmt(n) { return n.toLocaleString(); }

// ── Page Renderers ── (see pages.js)

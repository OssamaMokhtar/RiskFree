/**
 * GCC AI Credit Platform — Copilot Core Engine
 * Implements context awareness, inline actions, tool calling,
 * safety guardrails, and confidence-based escalation.
 *
 * UAE/CBUAE rules are the default regulatory context.
 */

// ============================================================
// 1. PII FILTER — strips sensitive identifiers before processing
// ============================================================
const PII_PATTERNS = [
  { name: 'Emirates ID', regex: /\b784-?\d{4}-?\d{7}-?\d\b/g, mask: '[ID REDACTED]' },
  { name: 'IBAN', regex: /\bAE\d{2}[A-Z0-9]{4}\d{16}\b/gi, mask: '[IBAN REDACTED]' },
  { name: 'Phone', regex: /\b(\+971|00971|05)\d{8,9}\b/g, mask: '[PHONE REDACTED]' },
  { name: 'Email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, mask: '[EMAIL REDACTED]' },
];

export const filterPII = (text) => {
  let sanitized = text;
  for (const pattern of PII_PATTERNS) {
    sanitized = sanitized.replace(pattern.regex, pattern.mask);
  }
  return sanitized;
};

// ============================================================
// 2. CONTEXT MANAGER — manages active session state
// ============================================================
let _context = {
  customerId: null,
  customerName: null,
  country: 'UAE',
  creditScore: null,
  riskLevel: null, // 'low' | 'medium' | 'high'
  product: null,
  activePage: 'dashboard',
};

export const CopilotContext = {
  set(updates) {
    _context = { ..._context, ...updates };
  },
  get() {
    return { ..._context };
  },
  reset() {
    _context = { customerId: null, customerName: null, country: 'UAE', creditScore: null, riskLevel: null, product: null, activePage: 'dashboard' };
  }
};

// ============================================================
// 3. UAE/CBUAE REGULATORY RULES
// ============================================================
export const REGULATORY_RULES = {
  UAE: {
    currency: 'AED',
    regulator: 'CBUAE',
    maxDSR: 0.50,
    minSalary: 5000,
    maxRetailTenorYears: 4,
    ageMin: 21,
    ageMaxAtMaturity: 65,
  },
  KSA: {
    currency: 'SAR',
    regulator: 'SAMA',
    maxDSR: 0.33,
    minSalary: 4000,
    maxRetailTenorYears: 5,
    ageMin: 21,
    ageMaxAtMaturity: 60,
  },
};

// ============================================================
// 4. CONFIDENCE SYSTEM & ESCALATION
// ============================================================
const CONFIDENCE_THRESHOLD = 0.80;

const buildDisclaimer = (lang = 'en') => {
  const disclaimers = {
    en: '⚠️ Note: This AI analysis requires human verification before any decision is made.',
    ar: '⚠️ ملاحظة: يتطلب هذا التحليل تحققاً بشرياً قبل اتخاذ أي قرار.',
  };
  return disclaimers[lang] || disclaimers.en;
};

const wrapResponse = (text, confidence, lang = 'en') => {
  if (confidence < CONFIDENCE_THRESHOLD) {
    return `${text}\n\n${buildDisclaimer(lang)}`;
  }
  return text;
};

// ============================================================
// 5. TOOL LIBRARY — inline action handlers
// ============================================================

/** Explains a credit score in plain language */
export const explainScore = ({ score, topFactors = [], lang = 'en' }) => {
  const rules = REGULATORY_RULES[_context.country] || REGULATORY_RULES.UAE;
  const grade = score >= 750 ? 'B+' : score >= 650 ? 'C+' : 'D';
  const confidence = score > 0 ? 0.92 : 0.5;

  const factorText = topFactors.length > 0
    ? topFactors.map(f => `• ${f.name}: ${f.impact > 0 ? '+' : ''}${f.impact} pts`).join('\n')
    : '• Insufficient factor data available.';

  const responseEn = `**Credit Score Analysis**\nScore: ${score} (Grade ${grade})\nRegulator: ${rules.regulator} | Country: ${_context.country}\n\nKey Drivers:\n${factorText}\n\nBased on ${rules.regulator} guidelines, applications with this score grade are subject to standard appraisal review.`;
  const responseAr = `**تحليل تقييم الائتمان**\nالتقييم: ${score} (الدرجة ${grade})\nجهة الرقابة: ${rules.regulator} | الدولة: ${_context.country}\n\nالعوامل الرئيسية:\n${factorText}\n\nوفقاً لإرشادات ${rules.regulator}، تخضع الطلبات ذات هذه الدرجة لمراجعة التقييم القياسية.`;

  const text = lang === 'ar' ? responseAr : responseEn;
  return { text: wrapResponse(text, confidence, lang), confidence };
};

/** Suggests a credit decision with rationale */
export const suggestDecision = ({ dsr, score, collateralAed = 0, lang = 'en' }) => {
  const rules = REGULATORY_RULES[_context.country] || REGULATORY_RULES.UAE;
  let confidence = 0.85;
  let decision = 'APPROVE';
  let rationale = [];

  if (dsr > rules.maxDSR) {
    decision = 'DECLINE';
    rationale.push(`DSR of ${(dsr * 100).toFixed(1)}% exceeds ${rules.regulator} limit of ${rules.maxDSR * 100}%.`);
    confidence = 0.95;
  }
  if (score < 500) {
    decision = 'DECLINE';
    rationale.push(`Credit score ${score} is below minimum acceptable threshold.`);
  }
  if (decision === 'DECLINE' && collateralAed > 0) {
    decision = 'CONDITIONAL_APPROVE';
    rationale.push(`Collateral of ${collateralAed.toLocaleString()} AED partially mitigates risk.`);
    confidence = 0.78;
  }

  const text_en = `**Recommended Decision: ${decision}**\n\nRationale:\n${rationale.map(r => `• ${r}`).join('\n') || '• All standard criteria met.'}`;
  const text_ar = `**القرار الموصى به: ${decision === 'APPROVE' ? 'موافقة' : decision === 'DECLINE' ? 'رفض' : 'موافقة مشروطة'}**\n\نالسبب:\n${rationale.map(r => `• ${r}`).join('\n') || '• تم استيفاء جميع المعايير القياسية.'}`;

  const text = lang === 'ar' ? text_ar : text_en;
  return { text: wrapResponse(text, confidence, lang), confidence, decision };
};

/** Drafts a customer communication email */
export const draftEmail = ({ decision, customerName, productType, lang = 'en' }) => {
  const confidence = 0.88;
  const safeCustomerName = filterPII(customerName || 'Valued Customer');

  const textEn = `**Draft Communication — ${decision}**\n\nDear ${safeCustomerName},\n\nThank you for your ${productType || 'loan'} application with us. Following our thorough assessment, we wish to inform you that your application has been **${decision.toLowerCase()}**.\n\nFor further queries, please contact your Relationship Manager.\n\nKind Regards,\nCredit Operations Team`;
  const textAr = `**مسودة التواصل — ${decision === 'APPROVED' ? 'موافقة' : 'رفض'}**\n\nعزيزي/عزيزتي ${safeCustomerName}،\n\nشكراً لتقديمك طلب ${productType || 'القرض'} لدينا. نود إعلامكم بأنه، بعد الدراسة الشاملة لطلبكم، فإنه قد تم **${decision === 'APPROVED' ? 'قبوله' : 'رفضه'}**.\n\nللاستفسار، يرجى التواصل مع مدير علاقاتكم.\n\nمع التحية،\nفريق عمليات الائتمان`;

  const text = lang === 'ar' ? textAr : textEn;
  return { text: wrapResponse(text, confidence, lang), confidence };
};

/** Summarizes a customer's financial profile */
export const summarizeCustomer = ({ customer, lang = 'en' }) => {
  const confidence = 0.90;
  const textEn = `**Customer Summary**\nCustomer: ${customer.name || 'N/A'} | Segment: ${customer.segment || 'Retail'}\nCredit Score: ${customer.score || 'N/A'} | Active Loans: ${customer.activeLoans || 0}\nDSR: ${customer.dsr ? (customer.dsr * 100).toFixed(1) + '%' : 'N/A'} | Bureau Status: ${customer.bureauStatus || 'Clear'}`;
  const textAr = `**ملخص العميل**\nالعميل: ${customer.name || 'غير متاح'} | القطاع: ${customer.segment === 'Retail' ? 'أفراد' : 'شركات'}\nالتقييم الائتماني: ${customer.score || 'غير متاح'} | القروض النشطة: ${customer.activeLoans || 0}\nنسبة عبء الدين: ${customer.dsr ? (customer.dsr * 100).toFixed(1) + '٪' : 'غير متاح'} | حالة المكتب: ${customer.bureauStatus || 'نظيف'}`;
  const text = lang === 'ar' ? textAr : textEn;
  return { text: wrapResponse(text, confidence, lang), confidence };
};

// ============================================================
// 6. MAIN COPILOT DISPATCHER — routes prompt to correct tool
// ============================================================
export const CopilotEngine = {
  /**
   * Processes a user prompt and returns a structured response.
   * @param {string} prompt - Raw user prompt
   * @param {string} lang - 'en' | 'ar'
   * @param {object} payload - Contextual data (score, dsr, customer, etc.)
   * @returns {Promise<{text: string, confidence: number}>}
   */
  async process(prompt, lang = 'en', payload = {}) {
    const lowerPrompt = filterPII(prompt.toLowerCase());

    // Tool routing based on keywords
    if (lowerPrompt.includes('explain') && lowerPrompt.includes('score')) {
      return explainScore({ score: payload.score || 0, topFactors: payload.topFactors || [], lang });
    }
    if (lowerPrompt.includes('suggest') || lowerPrompt.includes('decision') || lowerPrompt.includes('recommend')) {
      return suggestDecision({ dsr: payload.dsr || 0, score: payload.score || 0, collateralAed: payload.collateral || 0, lang });
    }
    if (lowerPrompt.includes('draft') || lowerPrompt.includes('email') || lowerPrompt.includes('communicate')) {
      return draftEmail({ decision: payload.decision || 'PENDING', customerName: payload.customerName, productType: payload.product, lang });
    }
    if (lowerPrompt.includes('summarize') || lowerPrompt.includes('profile') || lowerPrompt.includes('customer')) {
      return summarizeCustomer({ customer: payload.customer || {}, lang });
    }

    // Fallback generic response
    const fallback = {
      en: `I can help you with:\n• **Explain Score** — Review the SHAP-based credit analysis\n• **Suggest Decision** — Get a risk-based recommendation\n• **Draft Email** — Generate customer communication\n• **Summarize Customer** — View a quick profile overview`,
      ar: `يمكنني مساعدتك في:\n• **شرح التقييم** — مراجعة تحليل الائتمان\n• **اقتراح القرار** — الحصول على توصية مبنية على المخاطر\n• **صياغة بريد إلكتروني** — إنشاء رسالة للعميل\n• **ملخص العميل** — عرض نظرة عامة سريعة على الملف`,
    };
    return { text: fallback[lang] || fallback.en, confidence: 1.0 };
  }
};

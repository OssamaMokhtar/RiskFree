/**
 * GCC AI Credit Platform — Pulse Engine
 * Proactive anomaly detection logic for World-Class UX Elevation.
 *
 * This engine analyzes application state and flags critical insights
 * before the user even asks.
 */

export const ANOMALY_TYPES = {
  DSR_SPIKE: 'DSR_SPIKE',
  SECTOR_RISK: 'SECTOR_RISK',
  FRAUD_ALERTS: 'FRAUD_ALERTS',
  MISSING_DOCS: 'MISSING_DOCS',
  CASHFLOW_DIPS: 'CASHFLOW_DIPS',
};

export const PulseEngine = {
  /**
   * Evaluates the current state for anomalies.
   * @param {Object} data - Application data (salary, loan, score, etc.)
   * @returns {Array} - Array of detected insight objects.
   */
  evaluate(data) {
    const insights = [];

    // 1. DSR Spike Detection (CBUAE Limit 50%)
    const monthlyPmt = (data.loanAmount || 0) / (data.tenorMonths || 1);
    const dsr = monthlyPmt / Math.max(data.salary || 1, 1);
    if (dsr > 0.45) {
      insights.push({
        type: ANOMALY_TYPES.DSR_SPIKE,
        severity: 'high',
        label: { en: 'DSR Threshold Alert', ar: 'تنبيه تجاوز حد الدين' },
        summary: {
          en: `DSR of ${(dsr * 100).toFixed(1)}% is approaching CBUAE limit of 50%.`,
          ar: `انتباه: نسبة عبء الدين ${(dsr * 100).toFixed(1)}٪ تقترب من الحد الأقصى للمصرف المركزي (50٪).`,
        },
        action: 'suggest decision',
      });
    }

    // 2. Sector Risk Analysis (SME only)
    if (data.mode === 'sme' && data.sectorRisk > 0.15) {
      insights.push({
        type: ANOMALY_TYPES.SECTOR_RISK,
        severity: 'medium',
        label: { en: 'High Sector Risk', ar: 'مخاطر قطاع عالية' },
        summary: {
          en: `Sector risk is 20% higher than quarterly average for ${data.sector || 'the area'}.`,
          ar: `مخاطر القطاع أعلى بنسبة 20٪ من المتوسط الربع سنوي.`,
        },
        action: 'analyze sector',
      });
    }

    // 3. Fraud Anomaly Check (Simulated)
    if (data.isNewApplicant && data.loanAmount > 500000) {
      insights.push({
        type: ANOMALY_TYPES.FRAUD_ALERTS,
        severity: 'high',
        label: { en: 'Unusual Volume', ar: 'حجم تمويل غير معتاد' },
        summary: {
          en: 'Large loan requested for first-time profile. Enhanced KYC recommended.',
          ar: 'طلب تمويل كبير لملف تعريفي جديد. يوصى بتعزيز إجراءات "اعرف عميلك".',
        },
        action: 'check fraud',
      });
    }

    // 4. Missing Priority Docs
    if (!data.collateral && data.loanAmount > 200000) {
      insights.push({
        type: ANOMALY_TYPES.MISSING_DOCS,
        severity: 'medium',
        label: { en: 'Missing Collateral', ar: 'الضمانات مفقودة' },
        summary: {
          en: 'No collateral provided for high-value loan of AED 200k+.',
          ar: 'لم يتم تقديم ضمانات لتمويل بقيمة تزيد عن 200 ألف درهم.',
        },
        action: 'check documents',
      });
    }

    return insights;
  }
};

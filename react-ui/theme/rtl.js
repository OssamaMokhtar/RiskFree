export const rtlUtils = {
  isRTL: (lang) => lang === 'ar',
  getThemeFont: (lang, tokens) => 
    lang === 'ar' ? tokens.typography.fontAr : tokens.typography.fontEn,
  getJustifyContentX: (lang, position) => {
    if (position === 'start') return lang === 'ar' ? 'flex-end' : 'flex-start';
    if (position === 'end') return lang === 'ar' ? 'flex-start' : 'flex-end';
    return position; // center, space-between, etc.
  },
  // Handles generic styling swaps like margin-left <-> margin-right
  swapLogicalProps: (lang, prop) => {
    if (lang !== 'ar') return prop;
    const map = {
      marginLeft: 'marginRight',
      marginRight: 'marginLeft',
      paddingLeft: 'paddingRight',
      paddingRight: 'paddingLeft',
      left: 'right',
      right: 'left',
    };
    return map[prop] || prop;
  }
};

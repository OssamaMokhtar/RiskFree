import { useState, useLayoutEffect } from 'react';

export const useRTL = (initialLang = 'en') => {
  const [lang, setLang] = useState(initialLang);

  const direction = lang === 'ar' ? 'rtl' : 'ltr';

  useLayoutEffect(() => {
    // Sync React state directly to HTML attributes
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('lang', lang);
  }, [lang, direction]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  return { lang, direction, toggleLang, setLang };
};

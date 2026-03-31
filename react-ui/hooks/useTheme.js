import { useState, useLayoutEffect } from 'react';

export const useTheme = (initialTheme = 'dark') => {
  const [theme, setTheme] = useState(initialTheme);

  useLayoutEffect(() => {
    // Sync React state directly to body/html attribute to respect existing CSS
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme, setTheme };
};

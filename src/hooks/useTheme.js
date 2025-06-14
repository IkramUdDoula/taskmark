import { useState, useEffect } from 'react';

const THEMES = ['pastel', 'light', 'dark'];

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'pastel';
  });

  useEffect(() => {
    document.documentElement.classList.remove(...THEMES.map(t => `theme-${t}`));
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const computedStyle = getComputedStyle(document.documentElement);
      const bgColor = computedStyle.getPropertyValue('--bg-primary').trim();
      metaThemeColor.setAttribute('content', bgColor);
    }
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = THEMES.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setTheme(THEMES[nextIndex]);
  };

  return { theme, cycleTheme };
} 
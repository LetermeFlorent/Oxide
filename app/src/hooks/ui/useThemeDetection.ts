import { useEffect } from 'react';
import { useStore } from '../../store/useStore';

export function useThemeDetection() {
  const theme = useStore(s => s.theme);
  const setIsDark = useStore(s => s.setIsDark);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (isDark: boolean) => {
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
      setIsDark(isDark);
    };

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);
}

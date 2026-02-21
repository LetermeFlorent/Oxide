import en from './en.json';
import fr from './fr.json';

const translations: Record<string, any> = { en, fr };
const lang = navigator.language.startsWith('fr') ? 'fr' : 'en';

/**
 * Basic translation helper
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{{${k}}}`, String(v));
    });
  }

  return value;
}

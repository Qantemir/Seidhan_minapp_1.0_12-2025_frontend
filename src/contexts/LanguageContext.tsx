'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, defaultLanguage, type Language, type TranslationKey } from '@/lib/translations';

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return defaultLanguage;
    
    // Проверяем сохраненный язык
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (saved && (saved === 'ru' || saved === 'kk')) {
      return saved;
    }
    
    // Пытаемся определить язык из Telegram
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user?.language_code) {
        const langCode = tg.initDataUnsafe.user.language_code.toLowerCase();
        if (langCode.startsWith('kk') || langCode.startsWith('kz')) {
          return 'kk';
        }
        if (langCode.startsWith('ru')) {
          return 'ru';
        }
      }
    } catch {
      // Игнорируем ошибки
    }
    
    return defaultLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Обновляем HTML lang атрибут
      document.documentElement.lang = lang;
    }
  };

  // Обновляем HTML lang атрибут при изменении языка
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}


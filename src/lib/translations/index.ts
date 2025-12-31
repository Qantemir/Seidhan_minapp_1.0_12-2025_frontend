import { ru } from './ru';
import { kk } from './kk';

export type TranslationKey = typeof ru;
export type Language = 'ru' | 'kk';

export const translations = {
  ru,
  kk,
} as const;

export const defaultLanguage: Language = 'ru';

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақша' },
];


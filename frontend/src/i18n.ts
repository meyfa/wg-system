import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en.json'
import translationDE from './locales/de.json'

export const defaultNS = 'translation'
export const fallbackLng = 'en'

export const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  }
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS,
    resources,
    fallbackLng
  })
  .catch(e => console.error(e))

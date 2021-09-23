import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import translationEN from './locales/en.json'
import translationDE from './locales/de.json'

const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en'
  })
  .catch(e => console.error(e))

import 'i18next'
import { defaultNS, fallbackLng, resources } from './i18n'

// Ref https://www.i18next.com/overview/typescript
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS
    resources: typeof resources[typeof fallbackLng]
  }
}

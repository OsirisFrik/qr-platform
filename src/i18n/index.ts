import { computed, ref } from 'vue'
import en from './locales/en.json'
import es from './locales/es.json'

const localeData: Record<string, Record<string, any>> = { en, es }
const currentLocale = ref<'en' | 'es'>('en')

const availableLocales = [
  { code: 'en', name: 'English', iso: 'en-US' },
  { code: 'es', name: 'Español', iso: 'es-ES' }
]

export const useI18n = () => {
  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.')
    let result: any = localeData[currentLocale.value]
    for (const k of keys) {
      result = result?.[k]
    }
    let translation = result ?? key

    // Simple interpolation support
    if (params && typeof translation === 'string') {
      Object.entries(params).forEach(([key, value]) => {
        translation = translation.replace(`{${key}}`, String(value))
      })
    }

    return translation
  }

  const locale = computed(() => currentLocale.value)

  const locales = computed(() => availableLocales)

  const setLocale = (lang: string) => {
    if (lang === 'en' || lang === 'es') {
      currentLocale.value = lang
    }
  }

  return { t, locale, locales, setLocale }
}

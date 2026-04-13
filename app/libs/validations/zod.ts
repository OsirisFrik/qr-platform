import { z } from 'zod/v4'

export { z }

export function ArrayFirstEmpty<T extends z.core.SomeType>(target: T) {
  return z.preprocess((value) => {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      `${value[0]}`.trim() === ''
    ) {
      return []
    }

    return value
  }, target)
}

export async function loadZodLocale(locale: string) {
  console.log('loadZodLocale', locale)

  const local = z.locales[locale as keyof typeof z.locales]

  z.config(local())
}

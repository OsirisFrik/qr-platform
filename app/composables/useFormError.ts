import type z from 'zod'
import type { ZodError } from 'zod'

import type { FieldErrorMapped } from '@@/types/general'
import { toast } from 'vue-sonner'

export function useFormError<S extends z.ZodType>(
  schema: S,
  initialData: Ref<z.infer<S>>,
  initialErrors: FieldErrorMapped<z.infer<S>>
) {
  const i18n = useI18n()
  const data = computed({
    get() {
      return initialData
    },
    set(value) {}
  })
  const formErrors = ref(initialErrors)

  function validate(
    hideToast = false
  ):
    | { error: ZodError<z.infer<S>>; data: null }
    | { error: null; data: z.infer<S> } {
    const { error, data: validatedData } = schema.safeParse(data)

    if (error) {
      showFormErrors(error)

      return { error, data: null }
    }

    return { error: null, data: validatedData }
  }

  function showFormErrors(errors: ZodError<z.infer<S>>) {
    errors.issues.forEach((issue) => {
      const key = issue.path[0] as keyof z.infer<S>

      formErrors.value[key] = [true, issue.message]

      const fieldName = findI18nKey(key as string)

      if (fieldName === key) {
        toast.error(issue.message, {
          duration: 5000
        })
      } else {
        toast.error(fieldName, {
          duration: 5000,
          description: issue.message
        })
      }
    })

    return formErrors.value
  }

  function findI18nKey(path: string): string {
    const messages = i18n.messages.value[i18n.locale.value]

    for (const [_, moduleValue] of Object.entries(messages)) {
      if (
        typeof moduleValue === 'object' &&
        moduleValue !== null &&
        path in moduleValue
      ) {
        return moduleValue[path]
      }
    }

    return path
  }

  return {
    validate,
    showFormErrors,
    data,
    formErrors
  }
}

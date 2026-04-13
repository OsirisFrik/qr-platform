<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { RouterLink } from 'vue-router'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { mountIconSvg } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { LoginSchema, type ILoginForm } from '@/libs/validations/auth'
import { cn } from '@/utils/shadUtils'
import { LogInIcon } from 'lucide-vue-next'
import { ButtonIcon } from '@/components/ui/button'

import { useFormError } from '@/composables/useFormError'

const props = defineProps<{
  class?: HTMLAttributes['class']
  modelValue: ILoginForm
  loading?: boolean
}>()
const emit = defineEmits<{
  (e: 'update', value: ILoginForm): void
  (e: 'submit', value: ILoginForm): void
}>()
const _form = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update', value)
  }
})
const { validate, formErrors } = useFormError(LoginSchema, _form, {
  email: [false, null],
  password: [false, null]
})

function validateForm(): [boolean, ILoginForm | null] {
  const { error, data } = validate()

  if (error) return [true, null]

  return [false, data]
}

function onSubmit() {
  const [err, data] = validateForm()

  if (!err) {
    emit('submit', data!)
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>{{ $t('auth.loginMessage') }}</CardTitle>
        <CardDescription>
          {{ $t('auth.loginSubtitle') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="onSubmit">
          <FieldGroup>
            <Field :error="formErrors.email">
              <FieldLabel for="email">
                {{ $t('auth.email') }}
              </FieldLabel>
              <Input
                v-model="_form.email"
                id="email"
                type="email"
                placeholder="m@example.com"
                tabindex="1"
                :error="formErrors.email"
                required
                autofocus
              />
            </Field>
            <Field :error="formErrors.password">
              <div class="flex items-center">
                <FieldLabel for="password">
                  {{ $t('auth.password') }}
                </FieldLabel>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {{ $t('auth.forgotPassword') }}
                </a>
              </div>
              <Input
                v-model="_form.password"
                id="password"
                type="password"
                tabindex="2"
                :error="formErrors.password"
                required
              />
            </Field>
            <Field>
              <ButtonIcon type="submit" :icon="LogInIcon" :loading="loading">
                {{ $t('auth.login') }}
              </ButtonIcon>
              <ButtonIcon
                variant="outline"
                type="button"
                :icon="mountIconSvg({ name: 'google-fill', class: 'mt-2' })"
                :loading="loading"
              >
                {{ $t('auth.loginWithProvider', { provider: 'Google' }) }}
              </ButtonIcon>
              <FieldDescription class="text-center">
                {{ $t('auth.signUpMessage') }}
                <RouterLink to="/sign-up">
                  {{ $t('auth.signUp') }}
                </RouterLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from 'vue'
import { RouterLink } from 'vue-router'

import { ButtonIcon } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { SignUpSchema, type ISignUpForm } from '@/libs/validations/auth'
import { cn } from '@/utils/shadUtils'
import { LogInIcon } from 'lucide-vue-next'

const props = defineProps<{
  class?: HTMLAttributes['class']
  modelValue: ISignUpForm
}>()
const emit = defineEmits<{
  (e: 'update', value: ISignUpForm): void
  (e: 'submit', value: ISignUpForm): void
}>()

const _form = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update', value)
  }
})

const { validate, formErrors } = useFormError(SignUpSchema, _form, {
  email: [false, null],
  password: [false, null],
  confirm_password: [false, null],
  first_name: [false, null],
  last_name: [false, null]
})

function onSubmit() {
  const [err, data] = validateForm()

  if (!err) {
    emit('submit', data!)
  }
}

function validateForm(): [boolean, ISignUpForm | null] {
  const { error, data } = validate()

  if (!error) return [false, data]

  return [true, null]
}

defineExpose({
  validateForm
})
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>{{ $t('auth.createAccount') }}</CardTitle>
        <CardDescription>
          {{ $t('auth.createAccountMessage') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="() => onSubmit()">
          <FieldGroup>
            <Field>
              <Field class="grid grid-cols-2 gap-4">
                <Field :error="formErrors.first_name">
                  <FieldLabel for="firstName" required>
                    {{ $t('general.firstName') }}
                  </FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    v-model="_form.first_name"
                    :error="formErrors.first_name"
                    required
                  />
                </Field>
                <Field :error="formErrors.last_name">
                  <FieldLabel for="lastName" required>
                    {{ $t('general.lastName') }}
                  </FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    v-model="_form.last_name"
                    :error="formErrors.last_name"
                    required
                  />
                </Field>
              </Field>
            </Field>
            <Field>
              <FieldLabel for="email" required>
                {{ $t('auth.email') }}
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                v-model="_form.email"
                :error="formErrors.email"
                required
              />
            </Field>
            <Field>
              <FieldLabel for="password" required>
                {{ $t('auth.password') }}
              </FieldLabel>
              <Input
                id="password"
                type="password"
                v-model="_form.password"
                :error="formErrors.password"
                required
              />
              <FieldDescription>
                {{ $t('auth.passwordLength') }}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel for="confirmPassword" required>
                {{ $t('auth.confirmPassword') }}
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                v-model="_form.confirm_password"
                :error="formErrors.confirm_password"
                required
              />
              <FieldDescription>
                {{ $t('auth.confirmPasswordMessage') }}
              </FieldDescription>
            </Field>
            <Field>
              <ButtonIcon type="submit" :icon="LogInIcon">
                {{ $t('auth.signUp') }}
              </ButtonIcon>
              <!-- <ButtonIcon variant="outline" type="button" icon="ri-google-fill">
                {{ $t('auth.signUpWithProvider', { provider: 'Google' }) }}
              </ButtonIcon> -->
              <FieldDescription class="text-center">
                {{ $t('auth.alreadyHaveAccount') }}
                <RouterLink to="/login">
                  {{ $t('auth.login') }}
                </RouterLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

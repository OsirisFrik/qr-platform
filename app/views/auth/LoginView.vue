<script lang="ts" setup>
import LoginForm from '@/components/forms/auth/LoginForm.vue'
import { type ILoginForm } from '@/libs/validations/auth'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { ThemeToggle } from '@/components/ui/button'

const loading = ref(false)
const form = ref<ILoginForm>({
  email: '',
  password: ''
})

async function onSubmit(form: ILoginForm) {
  try {
    loading.value = true
    // await userStore.emailLogin(form.email, form.password)

    // toast.success(t('auth.loginSuccess'))

    // router.replace('/dashboard')
  } catch (err: any) {
    if (err.code === 'invalid_credentials') {
      toast.error($t('auth.invalidCredentials'))
    }
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <LoginForm v-model="form" @submit="onSubmit" />
    </div>

    <div class="fixed bottom-6 right-6">
      <ThemeToggle />
    </div>
  </div>
</template>

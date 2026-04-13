<script lang="ts" setup>
import SignUpForm from '@/components/forms/auth/SignUpForm.vue'
import { type ISignUpForm } from '@/libs/validations/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const form = ref<ISignUpForm>({
  email: '',
  password: '',
  confirm_password: '',
  first_name: '',
  last_name: ''
})
const router = useRouter()

async function onSubmit(form: ISignUpForm) {
  try {
    console.log('Submitting...')
    // await emailSignUp(form.email, form.password, {
    //   first_name: form.first_name,
    //   middle_name: form.middle_name,
    //   last_name: form.last_name,
    //   second_last_name: form.second_last_name
    // })

    // router.push('/dashboard')
  } catch (err) {
    console.trace(err)
  }
}
</script>
<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <SignUpForm v-model="form" @submit="onSubmit" />
    </div>
  </div>
</template>

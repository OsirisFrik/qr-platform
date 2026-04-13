import { z } from './zod'

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

export type ILoginForm = z.infer<typeof LoginSchema>

export const SignUpSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirm_password: z.string().min(8),
    first_name: z.string(),
    last_name: z.string()
  })
  .refine((data) => data.password === data.confirm_password, {
    error: 'Password does not match',
    path: ['confirmPassword']
  })

export type ISignUpForm = z.infer<typeof SignUpSchema>

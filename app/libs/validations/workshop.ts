import { z } from './zod'

export const CreateWorkshopSchema = z.object({
  name: z.string().min(2),
  business_id: z.string().min(3),
  phone: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional()
})

export type ICreateWorkshopForm = z.infer<typeof CreateWorkshopSchema>

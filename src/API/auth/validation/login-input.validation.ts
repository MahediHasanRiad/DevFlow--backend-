import {z} from 'zod'

export const LoginInputSchema = z.object({
    email: z.string().email({message: 'Email is Required !!!'}),
    password: z.string().min(1, {message: 'Password is Required !!!'}),
    deviceToken: z.string().optional()
})

export type LoginInputType = z.infer<typeof LoginInputSchema>
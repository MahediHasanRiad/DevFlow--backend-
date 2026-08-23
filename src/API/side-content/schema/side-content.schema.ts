import {z} from 'zod'

export const SideContentSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional()
})

export type SideContentType = z.infer<typeof SideContentSchema>
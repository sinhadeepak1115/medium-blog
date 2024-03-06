import z from 'zod';

export const signInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional()
})

export type SignInput = z.infer<typeof signInput>

export const postInput = z.object({
  title: z.string().toUpperCase(),
  content: z.string()
})

export type PostInput = z.infer<typeof postInput>

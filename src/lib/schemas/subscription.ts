import { z } from "zod"

export const emailSubscriptionRowSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  status: z.enum(["pending", "confirmed", "unsubscribed"]),
  confirmation_token: z.string(),
  confirmation_sent_at: z.string().nullable(),
  created_at: z.string(),
  confirmed_at: z.string().nullable(),
  unsubscribed_at: z.string().nullable(),
  updated_at: z.string(),
})

export const subscribeInputSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
})

export type SubscribeInput = z.infer<typeof subscribeInputSchema>

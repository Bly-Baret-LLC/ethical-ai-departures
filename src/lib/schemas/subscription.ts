import { z } from "zod"

export const emailSubscriptionRowSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  status: z.enum(["pending", "confirmed", "unsubscribed"]),
  confirmation_token: z.string(),
  created_at: z.string(),
  confirmed_at: z.string().nullable(),
})

export const subscribeInputSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type SubscribeInput = z.infer<typeof subscribeInputSchema>

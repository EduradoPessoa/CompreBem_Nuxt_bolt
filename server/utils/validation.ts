import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100)
})

export const shoppingListSchema = z.object({
  name: z.string().min(1).max(100),
  items: z.array(z.object({
    name: z.string().min(1).max(100),
    quantity: z.number().int().positive(),
    price: z.number().optional(),
    barcode: z.string().optional()
  })).optional()
})
import { hashPassword } from '../../utils/auth'
import { db } from '../../database/connection'
import { users } from '../../database/schema'
import { userSchema } from '../../utils/validation'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const result = userSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input'
    })
  }

  const { name, email, password } = result.data
  
  // Check if user exists
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email)
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'User already exists'
    })
  }

  // Create user
  const hashedPassword = await hashPassword(password)
  const userId = nanoid()

  await db.insert(users).values({
    id: userId,
    name,
    email,
    password: hashedPassword,
    createdAt: new Date()
  })

  return { success: true }
})
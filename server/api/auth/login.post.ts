import { verifyPassword, generateToken, authSchema } from '../../utils/auth'
import { db } from '../../database/connection'
import { users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Validate input
  const result = authSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid input'
    })
  }

  const { email, password } = result.data

  // Find user
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email)
  })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  // Generate token
  const token = await generateToken({
    id: user.id,
    email: user.email
  })

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  }
})
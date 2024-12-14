import { getRequestURL, H3Event } from 'h3'
import { verifyToken } from '../utils/auth'

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event)
  
  // Public routes that don't require authentication
  const publicRoutes = ['/api/auth/login', '/api/auth/register']
  if (publicRoutes.includes(url.pathname)) {
    return
  }

  const token = event.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const payload = await verifyToken(token)
  if (!payload) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  }

  // Add user to event context
  event.context.user = payload
})
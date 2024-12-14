import { RateLimiterMemory } from 'rate-limiter-flexible'
import { getRequestIP } from 'h3'

const authLimiter = new RateLimiterMemory({
  points: 5, // Number of attempts
  duration: 60 * 15, // 15 minutes
})

const apiLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per minute
})

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event)
  const path = event.path
  
  try {
    // Stricter limits for auth endpoints
    if (path.startsWith('/api/auth')) {
      await authLimiter.consume(ip)
    } else if (path.startsWith('/api')) {
      await apiLimiter.consume(ip)
    }
  } catch {
    throw createError({
      statusCode: 429,
      message: 'Too Many Requests'
    })
  }
})
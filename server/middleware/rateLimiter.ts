import { RateLimiterMemory } from 'rate-limiter-flexible'
import { getRequestIP, H3Event } from 'h3'

const limiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 1, // Per second
})

export default defineEventHandler(async (event: H3Event) => {
  const ip = getRequestIP(event)
  
  try {
    await limiter.consume(ip)
  } catch {
    throw createError({
      statusCode: 429,
      message: 'Too Many Requests'
    })
  }
})
import { db } from '../../../database/connection'
import { users, shoppingLists } from '../../../database/schema'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Check admin permission
  const user = event.context.user
  if (!user.isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    })
  }

  const { period = 30 } = getQuery(event)
  const days = parseInt(period as string)

  // Get daily user signups
  const signups = await db.select({
    date: sql<string>`date(created_at)`,
    count: sql<number>`count(*)`
  })
  .from(users)
  .where(sql`created_at >= date('now', '-${days} days')`)
  .groupBy(sql`date(created_at)`)
  .orderBy(sql`date(created_at)`)

  // Get daily active users
  const activeUsers = await db.select({
    date: sql<string>`date(created_at)`,
    count: sql<number>`count(distinct user_id)`
  })
  .from(shoppingLists)
  .where(sql`created_at >= date('now', '-${days} days')`)
  .groupBy(sql`date(created_at)`)
  .orderBy(sql`date(created_at)`)

  return {
    signups,
    activeUsers
  }
})
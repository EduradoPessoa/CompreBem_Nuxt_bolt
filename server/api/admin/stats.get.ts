import { db } from '../../database/connection'
import { users, shoppingLists } from '../../database/schema'
import { and, gte, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  // Check if user is admin
  const user = event.context.user
  if (!user.isAdmin) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden'
    })
  }

  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

  // Get current stats
  const [totalUsers, totalLists, activeUsers] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(shoppingLists),
    db.select({ count: sql<number>`count(distinct user_id)` })
      .from(shoppingLists)
      .where(gte(shoppingLists.createdAt, lastMonth))
  ])

  // Get last month's stats for trend calculation
  const [lastMonthUsers, lastMonthLists, lastMonthActive] = await Promise.all([
    db.select({ count: sql<number>`count(*)` })
      .from(users)
      .where(gte(users.createdAt, lastMonth)),
    db.select({ count: sql<number>`count(*)` })
      .from(shoppingLists)
      .where(gte(shoppingLists.createdAt, lastMonth)),
    db.select({ count: sql<number>`count(distinct user_id)` })
      .from(shoppingLists)
      .where(and(
        gte(shoppingLists.createdAt, lastMonth),
        sql`date(created_at) < date('now', '-1 month')`
      ))
  ])

  // Calculate trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 100
    return Math.round(((current - previous) / previous) * 100)
  }

  return {
    stats: [
      {
        label: 'Total Users',
        value: totalUsers[0].count,
        trend: calculateTrend(totalUsers[0].count, totalUsers[0].count - lastMonthUsers[0].count)
      },
      {
        label: 'Total Lists',
        value: totalLists[0].count,
        trend: calculateTrend(totalLists[0].count, totalLists[0].count - lastMonthLists[0].count)
      },
      {
        label: 'Active Users',
        value: activeUsers[0].count,
        trend: calculateTrend(activeUsers[0].count, lastMonthActive[0].count)
      }
    ]
  }
})